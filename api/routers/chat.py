from collections.abc import AsyncGenerator
import json

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
import httpx

from api.schemas.chat import ChatMessageIn
from api.routers.auth import get_current_user_id_from_jwt
from api.core.config import app_settings

ChatRouter = APIRouter(prefix="/chat")

@ChatRouter.post("/ask-llm")
async def send_message_to_llm(chat_message: ChatMessageIn, current_user_id: str = Depends(get_current_user_id_from_jwt)) -> StreamingResponse:
    
    async def stream_adk(user_id: str, session_id: str, message: str) -> AsyncGenerator[str]:
        payload = {
            "app_name": app_settings.app_name,
            "user_id": user_id,
            "session_id": session_id,
            "new_message": {
                "role": "user",
                "parts": [{"text": message}],
            },
            "streaming": True,
        }
        async with httpx.AsyncClient(timeout=60.0) as client:
            async with client.stream(
                "POST",
                f"{app_settings.adk_base_url}/run_sse",
                json=payload,
                headers={"Accept": "text/event-stream"}
            ) as response:
                if response.status_code != 200:
                    yield f"data: {json.dumps({"error": "ADK request failed"})}\n\n"
                    return

                async for line in response.aiter_lines():
                    if not line.startswith("data:"):
                        continue
                    try:
                        event = json.loads(line[len("data:"):].strip())
                        content = event.get("content")
                        if not content:
                            continue
                        parts = content.get("parts", [])
                        for part in parts:
                            if "text" in part:
                                # Send just the text chunk to the frontend
                                yield f"data: {json.dumps({'text': part['text'], 'session_id': session_id})}\n\n"
                    except json.JSONDecodeError:
                        continue

                # Signal the stream is done
                yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(
        stream_adk(current_user_id, chat_message.session_id, chat_message.content),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # important if behind nginx
        }
    )