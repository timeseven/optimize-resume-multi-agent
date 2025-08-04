from pydantic import BaseModel


class ResumeUpdate(BaseModel):
    parsed_json: dict
