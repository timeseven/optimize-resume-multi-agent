from typing import Annotated

from fastapi import Depends

from app.core.deps import DBConnDep
from app.modules.job.interface import IJobService
from app.modules.job.repos import JobRepo
from app.modules.job.services import JobService


async def get_job_repo(db: DBConnDep) -> JobRepo:
    return JobRepo(db=db)


JobRepoDep = Annotated[JobRepo, Depends(get_job_repo)]


async def get_job_service(job_repo: JobRepoDep):
    return JobService(job_repo=job_repo)


JobServiceDep = Annotated[IJobService, Depends(get_job_service)]
