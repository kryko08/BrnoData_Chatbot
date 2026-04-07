from pydantic import BaseModel


class ChatMessageIn(BaseModel):
    content: str
    session_id: str