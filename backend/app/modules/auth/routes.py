from fastapi import APIRouter
from fastapi.responses import ORJSONResponse

from app.modules.auth.deps import AuthServiceDep, UserDep
from app.modules.auth.schemas import Login, Register

auth_router = APIRouter(tags=["auth"])
user_router = APIRouter(tags=["user"])


@auth_router.post("/register")
async def register(auth_service: AuthServiceDep, data: Register):
    await auth_service.register(data=data)
    return {"message": "User registered successfully."}


@auth_router.post("/login")
async def login(response: ORJSONResponse, auth_service: AuthServiceDep, data: Login):
    await auth_service.login(response=response, data=data)
    return {"message": "User logged in successfully."}


@auth_router.post("/logout")
async def logout(response: ORJSONResponse, auth_service: AuthServiceDep):
    await auth_service.logout(response=response)
    return {"message": "User logged out successfully."}


@user_router.get("/me")
async def me(user: UserDep):
    return user
