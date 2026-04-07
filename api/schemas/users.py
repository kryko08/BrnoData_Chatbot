from typing import Annotated

from pydantic import BaseModel


class UserRegistrationSchema(BaseModel):
    username: str
    password: str
    email: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserMeOut(BaseModel):
    id: str
    is_admin: bool
    is_active: bool
    username: str
    email: str