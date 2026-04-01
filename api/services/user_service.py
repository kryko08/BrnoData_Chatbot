from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends

from api.services.service import CRUDService
from api.models import Users
from api.core.db import get_db


class UserService(CRUDService[Users]):
    model = Users


def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    return UserService(db)