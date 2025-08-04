from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi.responses import ORJSONResponse

MAX_DEVICES = 3

COMMON_COOKIE_PARAMS = {
    "path": "/",
    "domain": None,
    "httponly": True,
    "secure": True,
    "samesite": "lax",
}


# Token
def generate_token(
    token_type: str,
    secret_key: str,
    algorithm: str,
    expires_minutes: int,
    user_id: str,
) -> dict:
    created_at = datetime.now(timezone.utc)
    expires_at = created_at + timedelta(minutes=expires_minutes)

    token_payload = {
        "sub": user_id,
        "iat": created_at,
        "exp": expires_at,
        "type": token_type,
    }

    token = jwt.encode(
        payload=token_payload,
        key=secret_key,
        algorithm=algorithm,
    )

    return token, expires_at


# Cookie
def set_token_cookies(
    response: ORJSONResponse,
    access_token: str | None = None,
    access_expires_at: datetime | None = None,
    refresh_token: str | None = None,
    refresh_expires_at: datetime | None = None,
):
    if access_token and access_expires_at:
        response.set_cookie(
            key="access_token",
            value=access_token,
            expires=access_expires_at,
            **COMMON_COOKIE_PARAMS,
        )

    if refresh_token and refresh_expires_at:
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            expires=refresh_expires_at,
            **COMMON_COOKIE_PARAMS,
        )


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password=pwd_bytes, salt=salt)
    return hashed_password.decode("utf-8")
