from abc import ABC, abstractmethod

from app.modules.job.schemas import JobCreate, JobUpdate


class IJobService(ABC):
    @abstractmethod
    async def get_jobs(self, user_id: int):
        pass

    @abstractmethod
    async def get_job(self, user_id: int, job_id: int):
        pass

    @abstractmethod
    async def create_job(self, user_id: int, data: JobCreate):
        pass

    @abstractmethod
    async def update_job(self, user_id: int, job_id: int, data: JobUpdate):
        pass

    @abstractmethod
    async def delete_job(self, user_id: int, job_id: int):
        pass
