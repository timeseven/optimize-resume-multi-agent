from sqlalchemy import Boolean, Column, DateTime, Integer, String, Table, func, text

from app.core.models import metadata

User = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True, nullable=False, autoincrement=True),
    Column("email", String(255), nullable=False, unique=True),
    Column("hashed_password", String(255), nullable=True),
    Column("is_active", Boolean, nullable=False, server_default=text("true")),
    Column("created_at", DateTime(timezone=True), nullable=False, server_default=func.now()),
)
