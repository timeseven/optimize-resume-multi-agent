from pydantic import EmailStr
from sqlalchemy import insert, select
from sqlalchemy.ext.asyncio import AsyncConnection

from app.modules.auth.models import User


class AuthRepo:
    def __init__(self, db: AsyncConnection):
        self.db = db

    async def get_user_by_email(self, email: EmailStr):
        stmt = select(User).where(User.c.email == email)
        return (await self.db.execute(stmt)).mappings().first()

    async def get_user_by_id(self, user_id: int):
        stmt = select(User).where(User.c.id == user_id)
        return (await self.db.execute(stmt)).mappings().first()

    async def create_user(self, data: dict):
        stmt = insert(User).values(**data)
        await self.db.execute(stmt)
