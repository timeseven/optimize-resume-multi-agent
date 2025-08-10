from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Table,
    Text,
    func,
)
from sqlalchemy.dialects.sqlite import JSON

from app.core.models import metadata

Resume = Table(
    "resumes",
    metadata,
    Column("id", Integer, primary_key=True, nullable=False, autoincrement=True),
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
    Column("file_name", String(255), nullable=True),
    Column("file_size", Integer, nullable=True),
    Column("file_type", String(255), nullable=True),
    Column("raw_text", Text, nullable=False),
    Column("parsed_json", JSON, nullable=True),
    Column("created_at", DateTime(timezone=True), nullable=False, server_default=func.now()),
)
