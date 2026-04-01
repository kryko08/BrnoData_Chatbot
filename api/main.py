from typing import Annotated

from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer

from api.core.config import app_settings
from api.routers.sessions import SessionRouter
from api.routers.auth import AuthRouter


app = FastAPI()


@app.get("/info")
async def info():
    return {
        "app_name": app_settings.database_url,
        "password": app_settings.postgres_password,
    }


app.include_router(SessionRouter)
app.include_router(AuthRouter)
