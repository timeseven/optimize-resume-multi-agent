from typing import Any, Dict, Optional, TypedDict

from langgraph.graph import END, StateGraph

from app.modules.job.interface import IJobService
from app.modules.optimization.agents.gap_detector import GapDetectorAgent
from app.modules.optimization.agents.jd_analyzer import JDAnalyzerAgent
from app.modules.optimization.agents.resume_extractor import ResumeExtractorAgent
from app.modules.resume.interface import IResumeService


class OptimizationState(TypedDict):
    """State schema for the optimization workflow"""

    user_id: int
    resume_id: int
    job_id: int
    task_id: Optional[int]
    extract_resume: Optional[Dict[str, Any]]
    analyze_jd: Optional[Dict[str, Any]]
    gap_analysis: Optional[Dict[str, Any]]
    error: Optional[str]


class OptimizationGraph:
    """Wrapper class for better dependency management"""

    def __init__(self, resume_service: IResumeService, job_service: IJobService):
        self.resume_service = resume_service
        self.job_service = job_service
        self.resume_extractor = ResumeExtractorAgent(resume_service)
        self.jd_analyzer = JDAnalyzerAgent(job_service)
        self.gap_detector = GapDetectorAgent()
        self._build_graph()

    def _build_graph(self):
        """Build the workflow graph"""
        workflow = StateGraph(OptimizationState)

        # Add nodes with bound methods
        workflow.add_node("extract_resume", self._extract_resume_node)
        workflow.add_node("analyze_jd", self._analyze_jd_node)
        workflow.add_node("gap_analysis", self._gap_analysis_node)

        # Add edges
        workflow.add_edge("extract_resume", "analyze_jd")
        workflow.add_edge("analyze_jd", "gap_analysis")
        workflow.add_edge("gap_analysis", END)

        # Set entry point
        workflow.set_entry_point("extract_resume")

        # Compile
        self.app = workflow.compile()

    async def _extract_resume_node(self, state: OptimizationState) -> OptimizationState:
        """Extract resume information"""
        result = await self.resume_extractor.ainvoke(state)
        print("Extracted resume:", result)
        state["extract_resume"] = result
        return state

    async def _analyze_jd_node(self, state: OptimizationState) -> OptimizationState:
        """Analyze job description"""
        result = await self.jd_analyzer.ainvoke(state)
        print("Analyzed JD:", result)
        state["analyze_jd"] = result
        return state

    async def _gap_analysis_node(self, state: OptimizationState) -> OptimizationState:
        """Perform gap analysis"""
        result = await self.gap_detector.ainvoke(state)
        print("Gap analysis:", result)
        state["gap_analysis"] = result
        return state

    async def run(self, initial_state: OptimizationState) -> OptimizationState:
        """Run the optimization workflow"""
        return await self.app.ainvoke(initial_state)
