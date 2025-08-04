import json

from langchain_core.messages import HumanMessage

from app.core.llm import llm
from app.modules.optimization.exceptions import OptimizationBadRequest
from app.modules.resume.interface import IResumeService, ResumeUpdate


class ResumeExtractorAgent:
    def __init__(self, resume_service: IResumeService):
        self.resume_service = resume_service

    async def ainvoke(self, state):
        """Extract structured information from resume text and convert to JSON format with personal info, education,
        experience, skills, and projects."""
        # state must include: user_id, resume_id
        user_id = state["user_id"]
        resume_id = state["resume_id"]
        # fetch resume via service
        resume = await self.resume_service.get_resume(user_id, resume_id)
        # if already parsed, skip
        print("Resume already parsed:", resume.parsed_json)
        if resume.parsed_json:
            return {"parsed_json": resume.parsed_json}
        # otherwise extract
        raw = resume.raw_text
        prompt = f"""
        Extract structured information from the following resume text. Return ONLY a valid JSON object in the structure below.

        Rules:
        - Only output the JSON object, no explanation or formatting.
        - If a field is missing, use null (for strings) or [] (for arrays).
        - Preserve names, emails, links, and formatting as written.
        - Use "YYYY-MM" format for dates when possible.

        JSON schema:
        {{
        "personal_info": {{
            "name": null,
            "email": null,
            "phone": null,
            "location": null,
            "linkedin": null,
            "github": null,
            "website": null,
            "summary": null
        }},
        "education": [
            {{
            "institution": "",
            "degree": "",
            "major": null,
            "gpa": null,
            "start_date": null,
            "end_date": null,
            "location": null,
            "honors": null,
            "relevant_coursework": []
            }}
        ],
        "work_experience": [
            {{
            "company": "",
            "position": "",
            "start_date": null,
            "end_date": null,
            "location": null,
            "employment_type": null,
            "description": [],
            "achievements": []
            }}
        ],
        "projects": [
            {{
            "name": "",
            "description": null,
            "technologies": [],
            "start_date": null,
            "end_date": null,
            "url": null,
            "github": null,
            "highlights": []
            }}
        ],
        "skills": {{
            "technical": [],
            "programming_languages": [],
            "frameworks": [],
            "tools": [],
            "databases": [],
            "soft_skills": [],
            "languages": [],
            "certifications": []
        }},
        "additional": {{
            "certifications": [],
            "awards": [],
            "publications": [],
            "volunteer_work": [],
            "interests": []
        }}
        }}

        Resume text:
        {raw}

        Return JSON only:
        """

        try:
            # Invoke the chat model and extract content
            response = await llm.ainvoke([HumanMessage(content=prompt)])
            response_text = response.content.strip().lstrip("```json").rstrip("```").strip()

            parsed = json.loads(response_text)
        except Exception as e:
            print("Error in resume parsing:", e)
            raise OptimizationBadRequest(detail="Failed to parse resume extractor")

        # Persist parsed JSON
        await self.resume_service.update_resume(user_id, resume_id, ResumeUpdate(parsed_json=parsed))
        return {"parsed_json": parsed}
