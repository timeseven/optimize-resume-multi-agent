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
        You are an expert career advisor analyzing the gap between a candidate's resume and a job requirement. Your task is to:

        1. Normalize skill names in both resume and job description before comparison, using the following mappings and domain knowledge:
            - "REST API", "RESTful API" → "REST API"
            - "JS", "JavaScript" → "JavaScript"
            - "TS", "TypeScript" → "TypeScript"
            - "SQL" includes "T-SQL", "PL/pgSQL"
            Apply this normalization strictly to unify synonymous skill terms.

        2. Compare the normalized resume and job description data to identify gaps in:
            - Technical skills (programming languages, frameworks, tools, databases, cloud, methodologies)
            - Soft skills (communication, teamwork, leadership, attention to detail, etc.)
            - Experience (project scope, technologies used, domain knowledge)
            - Education (degrees, certifications)

        3. For technical skills:
            - Consider a skill as met if its keyword appears anywhere in the resume, regardless of whether detailed project experience is provided.
            - When project experience or practical application details exist, highlight them as strengths.
            - Do NOT treat the absence of detailed examples as a gap if the skill keyword is present.
            - Only list a gap for a technical skill if it is completely missing from the resume relative to job requirements.

        4. For soft skills:
            - Treat soft skills as met if explicitly mentioned anywhere in the resume.
            - Only consider a soft skill as a gap if it is completely absent.
            - Do not penalize vague or implied mentions.
            - Provide actionable development suggestions only when a soft skill is fully missing.

        5. For experience and education gaps:
            - Identify gaps only if required experience or education is clearly missing or insufficient relative to the job.
            - If resume shows any relevant experience or education, consider the requirement met.

        6. Prioritize gaps by criticality based on:
            - Skill importance to the job
            - Severity of the candidate's gap
            - Job context (e.g., cloud scale, IoT, data volume) to adjust priorities accordingly.

        7. Provide specific, actionable, and realistic recommendations with practical timelines.

        8. Do NOT list skills, experiences, or education that meet or exceed job requirements as gaps.

        9. Return ONLY a valid JSON object with the exact specified structure, with no additional text or explanations.



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
