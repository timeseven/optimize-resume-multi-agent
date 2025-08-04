from abc import ABC, abstractmethod


class IOptimizationService(ABC):
    @abstractmethod
    async def optimize(self, user_id: int, resume_id: int, job_id: int):
        pass

    @abstractmethod
    async def get_task_status(self, user_id: int, task_id: int):
        pass

    @abstractmethod
    async def get_user_tasks(self, user_id: int):
        pass
