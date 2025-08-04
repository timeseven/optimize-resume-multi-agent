from typing import Annotated

from fastapi import Depends

from app.core.deps import DBConnDep
from app.modules.job.deps import JobServiceDep
from app.modules.optimization.graph import OptimizationGraph
from app.modules.optimization.interface import IOptimizationService
from app.modules.optimization.repos import OptimizationRepo
from app.modules.optimization.services import OptimizationService
from app.modules.resume.deps import ResumeServiceDep


async def get_optimization_repo(db: DBConnDep) -> OptimizationRepo:
    return OptimizationRepo(db=db)


OptimizationRepoDep = Annotated[OptimizationRepo, Depends(get_optimization_repo)]


async def get_graph_service(resume_service: ResumeServiceDep, job_service: JobServiceDep):
    return OptimizationGraph(resume_service=resume_service, job_service=job_service)


AgentServiceDep = Annotated[OptimizationGraph, Depends(get_graph_service)]


async def get_optimization_service(optimization_repo: OptimizationRepoDep, agent_service: AgentServiceDep):
    return OptimizationService(optimization_repo=optimization_repo, agent_service=agent_service)


OptimizationServiceDep = Annotated[IOptimizationService, Depends(get_optimization_service)]
