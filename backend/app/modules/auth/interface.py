from abc import ABC, abstractmethod

from fastapi.responses import ORJSONResponse

from app.modules.auth.schemas import Login, Register


class IAuthService(ABC):
    @abstractmethod
    async def register(self, data: Register):
        pass

    @abstractmethod
    async def login(self, response: ORJSONResponse, data: Login):
        pass

    @abstractmethod
    async def logout(self, response: ORJSONResponse):
        pass

    @abstractmethod
    async def get_user_from_token(self, token: str, secret_key: str):
        pass
