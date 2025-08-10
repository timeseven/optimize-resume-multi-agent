from fastapi import APIRouter

from app.modules.auth.deps import UserDep
from app.modules.optimization.deps import OptimizationServiceDep
from app.modules.optimization.schemas import Optimize

op_router = APIRouter(tags=["optimization"])


@op_router.get("/tasks")
async def get_user_tasks(user: UserDep, optimization_service: OptimizationServiceDep):
    """Get user's optimization task history"""
    return await optimization_service.get_user_tasks(user.id)


@op_router.post("")
async def optimize(user: UserDep, optimization_service: OptimizationServiceDep, data: Optimize):
    return await optimization_service.optimize(user_id=user.id, resume_id=data.resume_id, job_id=data.job_id)


@op_router.get("/tasks/{task_id}")
async def get_task_status(user: UserDep, optimization_service: OptimizationServiceDep, task_id: int):
    """Get optimization task status and results"""
    result = await optimization_service.get_task_status(user.id, task_id)
    return result


@op_router.delete("/tasks/{task_id}")
async def delete_task(user: UserDep, optimization_service: OptimizationServiceDep, task_id: int):
    await optimization_service.delete_task(user.id, task_id)
    return {"message": "Delete task successfully."}
