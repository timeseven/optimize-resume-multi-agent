from fastapi import UploadFile

from app.modules.resume.interface import IResumeService
from app.modules.resume.repos import ResumeRepo
from app.modules.resume.schemas import ResumeUpdate
from app.modules.resume.utils import extract_raw_text


class ResumeService(IResumeService):
    def __init__(self, resume_repo: ResumeRepo):
        self.resume_repo = resume_repo

    async def get_resumes(self, user_id: int):
        return await self.resume_repo.get_resumes(user_id=user_id)

    async def get_resume(self, user_id: int, resume_id: int):
        return await self.resume_repo.get_resume(user_id=user_id, resume_id=resume_id)

    async def create_resume(self, user_id: int, file: UploadFile):
        raw_text = extract_raw_text(file)
        return await self.resume_repo.create_resume(user_id=user_id, data={"raw_text": raw_text})

    async def update_resume(self, user_id: int, resume_id: int, data: ResumeUpdate):
        return await self.resume_repo.update_resume(
            user_id=user_id, resume_id=resume_id, data={"parsed_json": data.parsed_json}
        )

    async def delete_resume(self, user_id: int, resume_id: int):
        return await self.resume_repo.delete_resume(user_id=user_id, resume_id=resume_id)
