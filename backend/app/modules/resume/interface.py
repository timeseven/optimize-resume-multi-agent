from abc import ABC, abstractmethod

from fastapi import UploadFile

from app.modules.resume.schemas import ResumeUpdate


class IResumeService(ABC):
    @abstractmethod
    async def get_resumes(self, user_id: int):
        pass

    @abstractmethod
    async def get_resume(self, user_id: int, resume_id: int):
        pass

    @abstractmethod
    async def create_resume(self, user_id: int, file: UploadFile):
        pass

    @abstractmethod
    async def update_resume(self, user_id: int, resume_id: int, data: ResumeUpdate):
        pass

    @abstractmethod
    async def delete_resume(self, user_id: int, resume_id: int):
        pass
