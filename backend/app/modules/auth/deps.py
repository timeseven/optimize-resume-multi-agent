from typing import Annotated

from fastapi import Depends

from app.core.config import settings
from app.core.deps import DBConnDep
from app.modules.auth.interface import IAuthService
from app.modules.auth.oauth2_scheme import oauth2_scheme
from app.modules.auth.repos import AuthRepo
from app.modules.auth.services import AuthService


async def get_auth_repo(db: DBConnDep) -> AuthRepo:
    return AuthRepo(db=db)


AuthRepoDep = Annotated[AuthRepo, Depends(get_auth_repo)]


async def get_auth_service(auth_repo: AuthRepoDep) -> IAuthService:
    return AuthService(auth_repo=auth_repo)


AuthServiceDep = Annotated[IAuthService, Depends(get_auth_service)]


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    auth_service: AuthServiceDep,
):
    user = await auth_service.get_user_from_token(token=token, secret_key=settings.ACCESS_SECRET_KEY)
    return user


UserDep = Annotated[dict, Depends(get_current_user)]
