from fastapi import APIRouter

from app.modules.auth.routes import auth_router, user_router
from app.modules.job.routes import job_router
from app.modules.optimization.routes import op_router
from app.modules.resume.routes import resume_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth")
api_router.include_router(user_router, prefix="/users")
api_router.include_router(resume_router, prefix="/resumes")
api_router.include_router(job_router, prefix="/jobs")
api_router.include_router(op_router, prefix="/optimization")
