from typing import Annotated

from fastapi import Depends

from app.core.deps import DBConnDep
from app.modules.resume.interface import IResumeService
from app.modules.resume.repos import ResumeRepo
from app.modules.resume.services import ResumeService


async def get_resume_repo(db: DBConnDep) -> ResumeRepo:
    return ResumeRepo(db=db)


ResumeRepoDep = Annotated[ResumeRepo, Depends(get_resume_repo)]


async def get_resume_service(resume_repo: ResumeRepoDep):
    return ResumeService(resume_repo=resume_repo)


ResumeServiceDep = Annotated[IResumeService, Depends(get_resume_service)]
