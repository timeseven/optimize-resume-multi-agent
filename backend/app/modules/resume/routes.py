from fastapi import APIRouter, UploadFile

from app.modules.auth.deps import UserDep
from app.modules.resume.deps import ResumeServiceDep

resume_router = APIRouter(tags=["resume"])


@resume_router.get("")
async def get_resumes(user: UserDep, resume_service: ResumeServiceDep):
    return await resume_service.get_resumes(user_id=user.id)


@resume_router.post("")
async def create_resume(user: UserDep, resume_service: ResumeServiceDep, file: UploadFile):
    await resume_service.create_resume(user_id=user.id, file=file)
    return {"message": "Resume uploaded successfully."}


@resume_router.delete("/{resume_id}")
async def delete_resume(user: UserDep, resume_service: ResumeServiceDep, resume_id: int):
    await resume_service.delete_resume(user_id=user.id, resume_id=resume_id)
    return {"message": "Resume deleted successfully."}
