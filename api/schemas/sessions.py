from datetime import datetime

from pydantic import BaseModel, ConfigDict, Json

from api.models import Events


class SessionOut(BaseModel):
    update_time: datetime
    id: str

    model_config = ConfigDict(from_attributes=True)


class SessionEvent(BaseModel):
    id: str
    role: str
    text: str
    timestamp: datetime

    @classmethod
    def from_orm_event(cls, event: Events) -> SessionEvent | None:
        data = event.event_data or {}
        content = data.get("content", {})
        role = content.get("role")

        if role not in ("user", "model"):
            return None

        parts = content.get("parts", [])
        text = next(
            (
                p["text"]
                for p in parts
                if "text" in p
            ),
            None,
        )

        return cls(
            id=event.id,
            role=role,
            text=text,
            timestamp=event.timestamp,
        )


class NewSessionOut(BaseModel):
    id: str
