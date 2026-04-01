from typing import Optional
import datetime

from sqlalchemy import (
    DateTime,
    ForeignKeyConstraint,
    PrimaryKeyConstraint,
    String,
    Boolean,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .core.db import Base


class AdkInternalMetadata(Base):
    __tablename__ = "adk_internal_metadata"
    __table_args__ = (PrimaryKeyConstraint("key", name="adk_internal_metadata_pkey"),)

    key: Mapped[str] = mapped_column(String(128), primary_key=True)
    value: Mapped[str] = mapped_column(String(256), nullable=False)


class AppStates(Base):
    __tablename__ = "app_states"
    __table_args__ = (PrimaryKeyConstraint("app_name", name="app_states_pkey"),)

    app_name: Mapped[str] = mapped_column(String(128), primary_key=True)
    state: Mapped[dict] = mapped_column(JSONB, nullable=False)
    update_time: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False)


class Sessions(Base):
    __tablename__ = "sessions"
    __table_args__ = (
        PrimaryKeyConstraint("app_name", "user_id", "id", name="sessions_pkey"),
        ForeignKeyConstraint(
            ["user_id"], ["users.id"], ondelete="CASCADE", name="sessions_user_id_fkey"
        ),
    )

    app_name: Mapped[str] = mapped_column(String(128), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(128), primary_key=True)
    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    state: Mapped[dict] = mapped_column(JSONB, nullable=False)
    create_time: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False)
    update_time: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False)

    user: Mapped["Users"] = relationship("Users", back_populates="sessions")
    events: Mapped[list["Events"]] = relationship("Events", back_populates="sessions")


class UserStates(Base):
    __tablename__ = "user_states"
    __table_args__ = (
        PrimaryKeyConstraint("app_name", "user_id", name="user_states_pkey"),
    )

    app_name: Mapped[str] = mapped_column(String(128), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(128), primary_key=True)
    state: Mapped[dict] = mapped_column(JSONB, nullable=False)
    update_time: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False)


class Events(Base):
    __tablename__ = "events"
    __table_args__ = (
        ForeignKeyConstraint(
            ["app_name", "user_id", "session_id"],
            ["sessions.app_name", "sessions.user_id", "sessions.id"],
            ondelete="CASCADE",
            name="events_app_name_user_id_session_id_fkey",
        ),
        PrimaryKeyConstraint(
            "id", "app_name", "user_id", "session_id", name="events_pkey"
        ),
    )

    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    app_name: Mapped[str] = mapped_column(String(128), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(128), primary_key=True)
    session_id: Mapped[str] = mapped_column(String(128), primary_key=True)
    invocation_id: Mapped[str] = mapped_column(String(256), nullable=False)
    timestamp: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False)
    event_data: Mapped[Optional[dict]] = mapped_column(JSONB)

    sessions: Mapped["Sessions"] = relationship("Sessions", back_populates="events")


class Users(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    email: Mapped[str] = mapped_column(String(256), unique=True, index=True)
    username: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(512))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    sessions: Mapped[list["Sessions"]] = relationship("Sessions", back_populates="user")
