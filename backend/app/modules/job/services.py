from app.modules.job.interface import IJobService
from app.modules.job.repos import JobRepo
from app.modules.job.schemas import JobCreate, JobUpdate


class JobService(IJobService):
    def __init__(self, job_repo: JobRepo):
        self.job_repo = job_repo

    async def get_jobs(self, user_id: int):
        return await self.job_repo.get_jobs(user_id=user_id)

    async def get_job(self, user_id: int, job_id: int):
        return await self.job_repo.get_job(user_id=user_id, job_id=job_id)

    async def create_job(self, user_id: int, data: JobCreate):
        return await self.job_repo.create_job(
            user_id=user_id,
            data={"title": data.title, "company": data.company, "job_description": data.job_description},
        )

    async def update_job(self, user_id: int, job_id: int, data: JobUpdate):
        return await self.job_repo.update_job(user_id=user_id, job_id=job_id, data={"parsed_json": data.parsed_json})

    async def delete_job(self, user_id: int, job_id: int):
        return await self.job_repo.delete_job(user_id=user_id, resume_id=job_id)
