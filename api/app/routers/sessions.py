from fastapi import APIRouter, Depends
from app.services.session_service import get_session_service, SessionService


SessionRouter = APIRouter("/sessions")


@SessionRouter.get("/all/")
async def get_all_sessions(
    sessions_service: SessionService = Depends(get_session_service)
):
    sessions = await sessions_service.get_many()
    return sessions

