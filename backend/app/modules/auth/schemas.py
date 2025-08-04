from pydantic import BaseModel, EmailStr


class Register(BaseModel):
    email: EmailStr
    password: str


class Login(BaseModel):
    email: EmailStr
    password: str
