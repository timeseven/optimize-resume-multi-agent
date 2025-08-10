import json

from sqlalchemy import delete, func, insert, select, update
from sqlalchemy.ext.asyncio import AsyncConnection

from app.modules.optimization.models import Output, Task


class OptimizationRepo:
    def __init__(self, db: AsyncConnection):
        self.db = db

    async def get_task_with_outputs(self, user_id: int, task_id: int):
        stmt = (
            select(Task, Output.c.agent, Output.c.output)
            .join(Output, Output.c.task_id == Task.c.id, isouter=True)
            .where(
                Task.c.id == task_id,
                Task.c.user_id == user_id,
            )
        )
        rows = (await self.db.execute(stmt)).mappings().all()

        if not rows:
            return None

        task_data = {k: v for k, v in rows[0].items() if k in Task.c.keys()}
        outputs_dict = {}

        for row in rows:
            if row["agent"]:
                output_data = row["output"] if isinstance(row["output"], dict) else json.loads(row["output"])

                if row["agent"] == "gap_detector" and "gap_analysis" in output_data:
                    outputs_dict[row["agent"]] = output_data["gap_analysis"]
                elif row["agent"] in ["job_analyzer", "resume_extractor"] and "parsed_json" in output_data:
                    outputs_dict[row["agent"]] = output_data["parsed_json"]
                else:
                    outputs_dict[row["agent"]] = output_data

        task_data["outputs"] = outputs_dict
        return task_data

    async def get_user_tasks(self, user_id: int):
        gap_score_subq = (
            select(
                func.json_extract(Output.c.output, "$.gap_analysis.overall_match_score").label("overall_match_score"),
            )
            .where(
                Output.c.agent == "gap_detector",
                Output.c.task_id == Task.c.id,
            )
            .order_by(Output.c.id.desc())
            .limit(1)
            .correlate(Task)
            .scalar_subquery()
        )

        stmt = select(Task, gap_score_subq.label("overall_match_score")).where(Task.c.user_id == user_id)

        rows = (await self.db.execute(stmt)).mappings().all()

        results = []
        for row in rows:
            task_dict = {k: v for k, v in row.items() if k in Task.c.keys()}
            outputs = {"gap_detector": {"overall_match_score": row.get("overall_match_score")}}
            task_dict["outputs"] = outputs
            results.append(task_dict)

        return results

    async def get_user_task(self, user_id: int, job_id: int, resume_id: int):
        stmt = select(Task).where(Task.c.user_id == user_id, Task.c.job_id == job_id, Task.c.resume_id == resume_id)
        return (await self.db.execute(stmt)).mappings().first()

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

    async def delete_task(self, user_id: int, task_id: int):
        stmt = delete(Task).where(Task.c.user_id == user_id, Task.c.id == task_id)
        await self.db.execute(stmt)
