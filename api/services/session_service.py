from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import Depends

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
            )
            .order_by(Events.timestamp)
        )
        return list(result.scalars().all())


def get_session_service(db: AsyncSession = Depends(get_db)) -> SessionService:
    return SessionService(db)
