from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends

from api.services.service import CRUDService
from api.models import Sessions
from api.core.db import get_db


class SessionService(CRUDService[Sessions]):
    model = Sessions


def get_session_service(db: AsyncSession = Depends(get_db)) -> SessionService:
    return SessionService(db)
