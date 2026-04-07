from datetime import datetime

from pydantic import BaseModel, ConfigDict, Json


class SessionOut(BaseModel):
    update_time: datetime
    id: str

    model_config = ConfigDict(from_attributes=True)


class SessionEvents(BaseModel):
    event_data: dict

    model_config = ConfigDict(from_attributes=True)


class NewSessionOut(BaseModel):
    id: str