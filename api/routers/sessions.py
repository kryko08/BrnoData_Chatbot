from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
import httpx

from api.services.session_service import get_session_service, SessionService
from api.routers.auth import get_current_user_id_from_jwt
from api.schemas.sessions import NewSessionOut, SessionOut, SessionEvent
from api.core.config import app_settings

SessionRouter = APIRouter(prefix="/sessions")


async def get_http_client():
    async with httpx.AsyncClient() as client:
        yield client


@SessionRouter.get("/")
async def get_my_sessions(
    session_service: SessionService = Depends(get_session_service),
    current_user_id: str = Depends(get_current_user_id_from_jwt),
) -> list[SessionOut]:
    my_sessions = await session_service.get_many(user_id=current_user_id)
    return [SessionOut.model_validate(s) for s in my_sessions]


@SessionRouter.get("/{session_id}/events")
async def get_session_events(
    session_id: str,
    session_service: SessionService = Depends(get_session_service),
    current_user_id: str = Depends(get_current_user_id_from_jwt),
) -> list[SessionEvent]:
    events = await session_service.get_session_events(session_id, current_user_id)

    result = []
    for e in events:
        parsed = SessionEvent.from_event(e.event_data)
        if parsed:
            result.append(parsed)

    return result


@SessionRouter.get("/new")
async def create_new_session(
    current_user_id: str = Depends(get_current_user_id_from_jwt),
    http_client: httpx.AsyncClient = Depends(get_http_client),
) -> NewSessionOut:
    session_id = str(uuid4())
    url = f"{app_settings.adk_base_url}/apps/{app_settings.app_name}/users/{current_user_id}/sessions/{session_id}"
    try:
        response = await http_client.post(url)
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=502, detail=f"Upstream request failed: {str(e)}"
        )

    if response.status_code not in (200, 201):
        raise HTTPException(
            status_code=response.status_code, detail=f"Session service error"
        )

    return NewSessionOut(id=session_id)
