from datetime import datetime

from pydantic import BaseModel, ConfigDict, Json


class SessionOut(BaseModel):
    update_time: datetime
    id: str

    model_config = ConfigDict(from_attributes=True)


class SessionEvent(BaseModel):
    id: str
    role: str
    text: str
    timestamp: float

    @classmethod
    def from_event(cls, event: dict) -> SessionEvent | None:
        """Return None if this event is not a displayable text message."""
        content = event.get("content", {})
        role = content.get("role")

        if role not in ("user", "model"):
            return None

        # Find the first text part, skip if none exists
        parts = content.get("parts", [])
        text = next(
            # Sure its definitely better to filter out the events on DB level, but could not find a way in SQL ALchemy :/
            (
                p["text"]
                for p in parts
                if "text" in p and not p.get("thought_signature")
            ),
            None,
        )

        if not text:
            return None

        return cls(
            id=event["id"],
            role=role,
            text=text,
            timestamp=event["timestamp"],
        )


class NewSessionOut(BaseModel):
    id: str
