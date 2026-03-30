from fastapi import FastAPI

from .core.config import AppSettings
from app.routers.sessions import SessionRouter

settings = AppSettings()

app = FastAPI()

@app.get("/info")
async def info():
    return {
        "app_name": settings.database_url,
        "password": settings.postgres_password
    }

app.include_router(SessionRouter)