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

Job = Table(
    "jobs",
    metadata,
    Column("id", Integer, primary_key=True, nullable=False, autoincrement=True),
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
    Column("title", String(255), nullable=True),
    Column("company", String(255), nullable=True),
    Column("job_description", Text, nullable=False),
    Column("parsed_json", JSON, nullable=True),
    Column("created_at", DateTime(timezone=True), nullable=False, server_default=func.now()),
)
