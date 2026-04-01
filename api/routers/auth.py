from asyncio import to_thread
import base64
from datetime import datetime, timedelta, timezone
from hashlib import pbkdf2_hmac
import os
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

import jwt
from jwt.exceptions import InvalidTokenError

from api.services.user_service import get_user_service, UserService
from api.schemas.users import UserRegistrationSchema, Token
from api.core.config import app_settings

HASH_ITERATIONS = 250_000

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

AuthRouter = APIRouter(prefix="/auth")


def hash_user_password(user_password: str) -> str:
    salt = os.urandom(16)
    dk = pbkdf2_hmac("sha256", user_password.encode("utf-8"), salt, HASH_ITERATIONS)
    hashed = base64.b64encode(salt + dk).decode("utf-8")
    return hashed


def verify_password(form_password: str, stored_hash: str) -> bool:
    decoded = base64.b64decode(stored_hash.encode("utf-8"))

    salt = decoded[:16]
    stored_dk = decoded[16:]

    new_dk = dk = pbkdf2_hmac(
        "sha256", form_password.encode("utf-8"), salt, HASH_ITERATIONS
    )

    return new_dk == stored_dk


async def get_current_user_id_from_jwt(
    token: OAuth2PasswordBearer = Depends(oauth2_scheme),
) -> str:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, app_settings.secret_jwt_key, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
    return user_id


def create_jwt_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, app_settings.secret_jwt_key, algorithm=ALGORITHM
    )
    return encoded_jwt


@AuthRouter.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(OAuth2PasswordRequestForm),
    user_service: UserService = Depends(get_user_service),
) -> Token:
    user = await user_service.get_one(username=form_data.username)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="This credentials combination does not match any existing user",
        )

    passwords_match = await to_thread(
        verify_password, form_data.password, user.hashed_password
    )
    if not passwords_match:
        raise HTTPException(
            status_code=401,
            detail="This credentials combination does not match any existing user",
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_jwt_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@AuthRouter.post("/register")
async def create_user(
    form_data: UserRegistrationSchema,
    user_service: UserService = Depends(get_user_service),
):
    user_id = str(uuid4())
    hashed_password = await to_thread(hash_user_password, form_data.password)
    new_user = await user_service.create_one(
        {
            "id": user_id,
            "email": form_data.email,
            "username": form_data.username,
            "hashed_password": hashed_password,
        }
    )
    return {"status": 200, "detail": "User created"}


@AuthRouter.get("/me")
async def get_me(
    current_user_id: str = Depends(get_current_user_id_from_jwt),
    user_service: UserService = Depends(get_user_service),
):
    user = await user_service.get_one(id=current_user_id)
    return user
