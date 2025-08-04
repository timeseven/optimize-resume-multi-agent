from pydantic import BaseModel, field_validator


class JobCreate(BaseModel):
    title: str
    company: str
    job_description: str

    @field_validator("job_description", mode="before")
    @classmethod
    def sanitize_raw_text(cls, v: str) -> str:
        if not isinstance(v, str):
            raise ValueError("description must be a string")

        v = v.replace("“", '"').replace("”", '"')
        v = v.replace("‘", "'").replace("’", "'")
        v = v.replace("\r", "")
        v = v.replace("\x00", "")
        v = "".join(c for c in v if ord(c) >= 32 or c in "\n\t")

        if not v.strip():
            raise ValueError("description cannot be empty")

        return v


class JobUpdate(BaseModel):
    parsed_json: dict
