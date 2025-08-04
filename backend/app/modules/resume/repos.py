from sqlalchemy import insert, select
from sqlalchemy.ext.asyncio import AsyncConnection

from app.modules.resume.models import Resume


class ResumeRepo:
    def __init__(self, db: AsyncConnection):
        self.db = db

    async def get_resumes(self, user_id: int):
        stmt = select(Resume).where(Resume.c.user_id == user_id)
        return (await self.db.execute(stmt)).mappings().all()

    async def get_resume(self, user_id: int, resume_id: int):
        stmt = select(Resume).where(Resume.c.id == resume_id, Resume.c.user_id == user_id)
        return (await self.db.execute(stmt)).mappings().first()

    async def create_resume(self, user_id: int, data: dict):
        stmt = insert(Resume).values(user_id=user_id, **data)
        await self.db.execute(stmt)

    async def update_resume(self, user_id: int, resume_id: int, data: dict):
        stmt = Resume.update().where(Resume.c.id == resume_id, Resume.c.user_id == user_id).values(**data)
        await self.db.execute(stmt)

    async def delete_resume(self, user_id: int, resume_id: int):
        stmt = Resume.delete().where(Resume.c.id == resume_id, Resume.c.user_id == user_id)
        await self.db.execute(stmt)
