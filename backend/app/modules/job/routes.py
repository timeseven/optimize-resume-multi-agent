from fastapi import APIRouter, Form

from app.modules.auth.deps import UserDep
from app.modules.job.deps import JobServiceDep
from app.modules.job.schemas import JobCreate

job_router = APIRouter(tags=["job"])


@job_router.get("")
async def get_jobs(user: UserDep, job_service: JobServiceDep):
    return await job_service.get_jobs(user_id=user.id)


@job_router.post("")
async def create_job(
    user: UserDep,
    job_service: JobServiceDep,
    title: str = Form(...),
    company: str = Form(...),
    job_description: str = Form(...),
):
    await job_service.create_job(
        user_id=user.id, data=JobCreate(title=title, company=company, job_description=job_description)
    )
    return {"message": "Job created successfully."}


@job_router.delete("/{job_id}")
async def delete_job(user: UserDep, job_service: JobServiceDep, job_id: int):
    await job_service.delete_job(user_id=user.id, job_id=job_id)
    return {"message": "Job deleted successfully."}
