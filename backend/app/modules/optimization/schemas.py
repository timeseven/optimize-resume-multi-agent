from pydantic import BaseModel


class Optimize(BaseModel):
    resume_id: int
    job_id: int
