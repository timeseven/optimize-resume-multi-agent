import json

from langchain_core.messages import HumanMessage

from app.core.llm import llm
from app.modules.job.interface import IJobService, JobUpdate
from app.modules.optimization.exceptions import OptimizationBadRequest


class JDAnalyzerAgent:
    def __init__(self, job_service: IJobService):
        self.job_service = job_service

    async def ainvoke(self, state):
        """Analyze job description and extract structured information including requirements, qualifications, skills,
        and company details."""
        user_id = state["user_id"]
        job_id = state["job_id"]
        job = await self.job_service.get_job(user_id, job_id)
        if job.parsed_json:
            return {"parsed_json": job.parsed_json}
        raw = f"{job.title}\n{job.company}\n{job.job_description}"
        prompt = f"""
        You are a professional job description analyzer. Extract information from the following job posting and
        return ONLY a valid JSON object with the exact structure shown below.

        IMPORTANT RULES:
        1. Return ONLY the JSON object, no other text or explanations
        2. If a field is not found, use null for strings/objects or [] for arrays
        3. Preserve original formatting for company names and job titles
        4. Extract all skills mentioned, both technical and soft skills
        5. Separate required vs preferred qualifications when possible
        6. Include salary information if mentioned
        7. Extract work arrangement details (remote, hybrid, on-site)
        8. Identify seniority level from title or description

        Required JSON structure:
        ```json
        {{
        "job_info": {{
            "title": "string or null",
            "company": "string or null",
            "location": "string or null",
            "work_arrangement": "string or null",
            "employment_type": "string or null",
            "seniority_level": "string or null",
            "department": "string or null",
            "industry": "string or null",
            "job_function": "string or null"
        }},
        "compensation": {{
            "salary_min": "string or null",
            "salary_max": "string or null",
            "currency": "string or null",
            "salary_type": "string or null",
            "benefits": []
        }},
        "job_description": {{
            "summary": "string or null",
            "responsibilities": [],
            "key_requirements": [],
            "day_to_day_tasks": []
        }},
        "qualifications": {{
            "required_education": [],
            "preferred_education": [],
            "required_experience": "string or null",
            "preferred_experience": "string or null",
            "required_skills": [],
            "preferred_skills": [],
            "certifications": [],
            "languages": []
        }},
        "skills_breakdown": {{
            "technical_skills": [],
            "programming_languages": [],
            "frameworks_libraries": [],
            "tools_platforms": [],
            "databases": [],
            "cloud_technologies": [],
            "methodologies": [],
            "soft_skills": []
        }},
        "company_info": {{
            "company_description": "string or null",
            "company_size": "string or null",
            "company_culture": [],
            "growth_opportunities": []
        }},
        "application_info": {{
            "application_deadline": "string or null",
            "contact_person": "string or null",
            "application_process": "string or null",
            "additional_instructions": "string or null"
        }}
        }}
        ```

        Job description to analyze:
        {raw}

        JSON:"""
        try:
            # Invoke the chat model and extract content
            response = await llm.ainvoke([HumanMessage(content=prompt)])
            response_text = response.content.strip().lstrip("```json").rstrip("```").strip()

            parsed = json.loads(response_text)
        except Exception as e:
            print("Error in job description parsing:", e)
            raise OptimizationBadRequest("Failed to parse job description")

        await self.job_service.update_job(user_id, job_id, JobUpdate(parsed_json=parsed))
        return {"parsed_json": parsed}
