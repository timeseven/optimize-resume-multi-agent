import jwt
from fastapi.responses import ORJSONResponse
from jwt.exceptions import DecodeError, ExpiredSignatureError, InvalidTokenError

from app.core.config import settings
from app.modules.auth.exceptions import (
    InvalidCredentials,
)
from app.modules.auth.interface import IAuthService
from app.modules.auth.repos import AuthRepo
from app.modules.auth.schemas import Login, Register
from app.modules.auth.utils import generate_token, get_password_hash, set_token_cookies, verify_password


class AuthService(IAuthService):
    def __init__(self, auth_repo: AuthRepo):
        self.auth_repo = auth_repo

    async def register(self, data: Register):
        user = await self.auth_repo.get_user_by_email(email=data.email)
        if user:
            raise Exception("User already exists")
        hashed_password = get_password_hash(password=data.password)
        await self.auth_repo.create_user(data={"email": data.email, "hashed_password": hashed_password})

    async def login(self, response: ORJSONResponse, data: Login):
        user = await self.auth_repo.get_user_by_email(email=data.email)
        if not user:
            raise Exception("User not found")
        if not user.hashed_password:
            raise Exception("User not found")
        if not verify_password(plain_password=data.password, hashed_password=user.hashed_password):
            raise Exception("Invalid password")

        access_token, access_expires_at = generate_token(
            "access_token",
            settings.ACCESS_SECRET_KEY,
            settings.ALGORITHM,
            settings.ACCESS_TOKEN_EXPIRE_MINUTES,
            str(user.id),
        )

        set_token_cookies(response, access_token, access_expires_at)

        return response

    async def logout(self, response: ORJSONResponse):
        response.delete_cookie(key="access_token")
        return response

    async def get_user_from_token(self, token: str, secret_key: str):
        try:
            payload = jwt.decode(
                token,
                secret_key,
                algorithms=[settings.ALGORITHM],
            )
            user_id = str(payload.get("sub"))
            if not user_id:
                raise InvalidCredentials
        except (DecodeError, ExpiredSignatureError, InvalidTokenError):
            raise InvalidCredentials

        user = await self.auth_repo.get_user_by_id(user_id=user_id)

        if not user:
            raise InvalidCredentials
        if not user.is_active:
            raise InvalidCredentials(detail="User is not active")

        return user
