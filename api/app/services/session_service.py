from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends

from app.services.service import CRUDService
from app.models import Sessions
from app.core.db import get_db


class SessionService(CRUDService[Sessions]):
    model: Sessions


def get_session_service(db: AsyncSession = Depends(get_db)) -> SessionService:
    return SessionService(db)
