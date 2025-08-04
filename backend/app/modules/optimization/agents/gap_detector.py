import json

from langchain_core.messages import HumanMessage

from app.core.llm import llm
from app.modules.optimization.exceptions import OptimizationBadRequest


class GapDetectorAgent:
    async def ainvoke(self, state):
        """Analyze gaps between resume and job requirements, providing detailed recommendations for improvement."""
        resume_json = state["extract_resume"]["parsed_json"]
        job_json = state["analyze_jd"]["parsed_json"]

        prompt = f"""
        You are an expert career advisor analyzing the gap between a candidate's resume and a job requirement.
        Compare the resume and job description to identify gaps and provide actionable recommendations.

        IMPORTANT RULES:
        1. Return ONLY a valid JSON object with the exact structure shown below
        2. Be specific and actionable in recommendations
        3. Prioritize the most critical gaps first
        4. Consider both hard skills and soft skills
        5. Provide realistic timelines for addressing gaps

        Required JSON structure:
        ```json
        {{
        "overall_match_score": "number (0-100)",
        "match_summary": "string",
        "critical_gaps": {{
            "missing_technical_skills": [
            {{
                "skill": "string",
                "importance": "high|medium|low",
                "gap_description": "string",
                "learning_resource_suggestions": []
            }}
            ],
            "missing_soft_skills": [
            {{
                "skill": "string",
                "importance": "high|medium|low",
                "gap_description": "string",
                "development_suggestions": []
            }}
            ],
            "experience_gaps": [
            {{
                "area": "string",
                "required_experience": "string",
                "current_experience": "string",
                "gap_description": "string",
                "bridging_suggestions": []
            }}
            ],
            "education_gaps": [
            {{
                "requirement": "string",
                "current_status": "string",
                "gap_description": "string",
                "options": []
            }}
            ]
        }},
        "strengths": [
            {{
            "area": "string",
            "description": "string",
            "how_to_highlight": "string"
            }}
        ],
        "recommendations": {{
            "immediate_actions": [
            {{
                "action": "string",
                "timeline": "string",
                "priority": "high|medium|low",
                "expected_impact": "string"
            }}
            ],
            "short_term_improvements": [
            {{
                "improvement": "string",
                "timeline": "string",
                "resources_needed": [],
                "expected_outcome": "string"
            }}
            ],
            "long_term_development": [
            {{
                "development_area": "string",
                "timeline": "string",
                "investment_required": "string",
                "career_impact": "string"
            }}
            ]
        }},
        "resume_optimization": {{
            "keyword_suggestions": [],
            "section_improvements": [
            {{
                "section": "string",
                "current_issue": "string",
                "improvement_suggestion": "string"
            }}
            ],
            "formatting_suggestions": []
        }},
        "interview_preparation": {{
            "likely_questions": [],
            "areas_to_emphasize": [],
            "potential_concerns_to_address": []
        }}
        }}
        ```

        Resume Data:
        {json.dumps(resume_json, indent=2)}

        Job Requirements:
        {json.dumps(job_json, indent=2)}

        JSON:"""
        try:
            # Invoke the chat model and extract content
            response = await llm.ainvoke([HumanMessage(content=prompt)])
            response_text = response.content.strip().lstrip("```json").rstrip("```").strip()

            parsed = json.loads(response_text)
        except Exception as e:
            print("Failed to parse gap detector", e)
            raise OptimizationBadRequest(detail="Failed to parse gap detector")

        return {"gap_analysis": parsed}
