from sqlalchemy import insert, select, update
from sqlalchemy.ext.asyncio import AsyncConnection

from app.modules.optimization.models import Output, Task


class OptimizationRepo:
    def __init__(self, db: AsyncConnection):
        self.db = db

    async def get_task_with_outputs(self, user_id: int, task_id: int):
        stmt = (
            select(Task, Output.c.agent, Output.c.output)
            .where(Task.c.id == task_id, Task.c.user_id == user_id)
            .join(Output, isouter=True)
        )
        return (await self.db.execute(stmt)).mappings().first()

    async def get_user_tasks(self, user_id: int):
        stmt = select(Task).where(Task.c.user_id == user_id)
        return (await self.db.execute(stmt)).mappings().all()

    async def create_task(self, user_id: int, resume_id: int, job_id: int):
        stmt = insert(Task).values(user_id=user_id, resume_id=resume_id, job_id=job_id)
        result = await self.db.execute(stmt)
        return result.inserted_primary_key[0]

    async def update_task(self, task_id: int, data: dict):
        stmt = update(Task).where(Task.c.id == task_id).values(**data)
        await self.db.execute(stmt)

    async def create_output(self, user_id: int, task_id: int, data: dict):
        stmt = insert(Output).values(user_id=user_id, task_id=task_id, **data)
        await self.db.execute(stmt)
