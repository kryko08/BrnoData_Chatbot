from fastapi import APIRouter, Depends

from api.services.session_service import get_session_service, SessionService
from api.routers.auth import get_current_user_id_from_jwt

SessionRouter = APIRouter(prefix="/sessions")


@SessionRouter.get("/all/")
async def get_all_sessions(
    sessions_service: SessionService = Depends(get_session_service)
):
    sessions = await sessions_service.get_many()
    return sessions


@SessionRouter.get("/my-sessions")
async def get_my_sessions(
    session_service: SessionService = Depends(get_session_service),
    current_user_id: str = Depends(get_current_user_id_from_jwt),
):
    my_sessions = await session_service.get_many(user_id=current_user_id)
    return my_sessions

