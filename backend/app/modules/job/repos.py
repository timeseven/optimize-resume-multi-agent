from sqlalchemy import insert, select
from sqlalchemy.ext.asyncio import AsyncConnection

from app.modules.job.models import Job


class JobRepo:
    def __init__(self, db: AsyncConnection):
        self.db = db

    async def get_jobs(self, user_id: int):
        stmt = select(Job).where(Job.c.user_id == user_id)
        return (await self.db.execute(stmt)).mappings().all()

    async def get_job(self, user_id: int, job_id: int):
        stmt = select(Job).where(Job.c.id == job_id, Job.c.user_id == user_id)
        return (await self.db.execute(stmt)).mappings().first()

    async def create_job(self, user_id: int, data: dict):
        stmt = insert(Job).values(user_id=user_id, **data)
        await self.db.execute(stmt)

    async def update_job(self, user_id: int, job_id: int, data: dict):
        stmt = Job.update().where(Job.c.id == job_id, Job.c.user_id == user_id).values(**data)
        await self.db.execute(stmt)

    async def delete_job(self, user_id: int, resume_id: int):
        stmt = Job.delete().where(Job.c.id == resume_id, Job.c.user_id == user_id)
        await self.db.execute(stmt)
