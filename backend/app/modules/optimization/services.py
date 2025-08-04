from datetime import datetime, timezone

from app.modules.optimization.exceptions import OptimizationBadRequest
from app.modules.optimization.graph import OptimizationGraph
from app.modules.optimization.interface import IOptimizationService
from app.modules.optimization.repos import OptimizationRepo


class OptimizationService(IOptimizationService):
    def __init__(
        self,
        optimization_repo: OptimizationRepo,
        agent_service: OptimizationGraph,
    ):
        self.optimization_repo = optimization_repo
        self.agent_service = agent_service

    async def get_task_status(self, user_id: int, task_id: int):
        return await self.optimization_repo.get_task_with_outputs(user_id=user_id, task_id=task_id)

    async def get_user_tasks(self, user_id):
        return await self.optimization_repo.get_user_tasks(user_id=user_id)

    async def _store_agent_outputs(self, user_id: int, task_id: int, final_state: dict):
        """Store outputs from each agent in the outputs table"""
        # Store resume extraction output
        if "extract_resume" in final_state:
            await self.optimization_repo.create_output(
                user_id=user_id,
                task_id=task_id,
                data={"agent": "resume_extractor", "output": final_state["extract_resume"]},
            )
        # Store job analysis output
        if "analyze_jd" in final_state:
            await self.optimization_repo.create_output(
                user_id=user_id, task_id=task_id, data={"agent": "job_analyzer", "output": final_state["analyze_jd"]}
            )
        # Store gap analysis output
        if "gap_analysis" in final_state:
            await self.optimization_repo.create_output(
                user_id=user_id, task_id=task_id, data={"agent": "gap_detector", "output": final_state["gap_analysis"]}
            )

    async def optimize(self, user_id: int, resume_id: int, job_id: int):
        """
        Main optimization workflow:
        1. Create task record
        2. Run the graph workflow (extract resume -> analyze JD -> detect gaps)
        3. Store outputs from each agent
        4. Update task status
        """
        try:
            task_id = await self.optimization_repo.create_task(user_id=user_id, resume_id=resume_id, job_id=job_id)

            # Prepare initial state for the graph
            initial_state = {
                "user_id": user_id,
                "resume_id": resume_id,
                "job_id": job_id,
                "task_id": task_id,
            }

            # Run the graph workflow
            final_state = await self.agent_service.run(initial_state)
            if final_state.get("error"):
                print(">>>>>>>>>>>>")
                await self.optimization_repo.update_task(
                    task_id=task_id,
                    data={"status": "failed", "finished_at": datetime.now(timezone.utc)},
                )
                return {"task_id": task_id, "status": "failed", "results": final_state["error"]}

            # Store outputs from each agent
            await self._store_agent_outputs(user_id, task_id, final_state)

            # Update task status to finished
            await self.optimization_repo.update_task(
                task_id=task_id, data={"status": "finished", "finished_at": datetime.now(timezone.utc)}
            )

            return {"task_id": task_id, "status": "finished", "results": final_state}
        except Exception as e:
            if "task_id" in locals():
                await self.optimization_repo.update_task(
                    task_id=task_id, data={"status": "failed", "finished_at": datetime.now(timezone.utc)}
                )
            raise OptimizationBadRequest(detail=str(e))
