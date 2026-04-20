from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, cast, func
from fastapi import Depends
from fastapi_pagination import Page, Params
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy.dialects.postgresql import JSONPATH

from api.schemas.sessions import SessionEvent
from api.services.service import CRUDService
from api.models import Sessions, Events
from api.core.db import get_db


class SessionService(CRUDService[Sessions]):
    model = Sessions

    async def get_session_events(self, session_id: str, user_id: str) -> list[Events]:
        result = await self.session.execute(
            select(Events)
            .where(
                Events.user_id == user_id,
                Events.session_id == session_id,
                func.jsonb_path_exists(
                    Events.event_data,
                    cast('$.content.parts[*] ? (@.text != null)', JSONPATH)
                )
            )
            .order_by(Events.timestamp)
        )
        return list(result.scalars().all())
    

    async def get_paginated_session_events(self, params: Params, session_id: str, user_id: str) -> Page[Events]:
        query = select(Events).where(
                Events.user_id == user_id,
                Events.session_id == session_id,
            ).order_by(Events.timestamp)
        
        def transform(events: list[Events]) -> list[SessionEvent]:
            result = []
            for e in events:
                parsed = SessionEvent.from_event(e.event_data)
                if parsed:
                    result.append(parsed)
            return result
        
        return await paginate(self.session, query, params, transformer=transform)


def get_session_service(db: AsyncSession = Depends(get_db)) -> SessionService:
    return SessionService(db)
