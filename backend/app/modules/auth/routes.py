from fastapi import APIRouter
from fastapi.responses import ORJSONResponse

from app.modules.auth.deps import AuthServiceDep
from app.modules.auth.schemas import Login, Register

auth_router = APIRouter(tags=["auth"])


@auth_router.post("/register")
async def register(auth_service: AuthServiceDep, data: Register):
    await auth_service.register(data=data)
    return {"message": "User registered successfully."}


@auth_router.post("/login")
async def login(response: ORJSONResponse, auth_service: AuthServiceDep, data: Login):
    await auth_service.login(response=response, data=data)
    return {"message": "User logged in successfully."}
