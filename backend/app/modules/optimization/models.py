from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Table, Text, func, text
from sqlalchemy.dialects.sqlite import JSON

from app.core.models import metadata

Task = Table(
    "tasks",
    metadata,
    Column("id", Integer, primary_key=True, nullable=False, autoincrement=True),
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
    Column("resume_id", Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False),
    Column("job_id", Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False),
    Column("status", String(36), nullable=False, server_default=text("'pending'")),
    Column("created_at", DateTime(timezone=True), nullable=False, server_default=func.now()),
    Column("finished_at", DateTime(timezone=True), nullable=True),
)


Output = Table(
    "outputs",
    metadata,
    Column("id", Integer, primary_key=True, nullable=False, autoincrement=True),
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
    Column("task_id", Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False),
    Column("agent", String(50), nullable=False),
    Column("output", JSON, nullable=False),
    Column("created_at", DateTime(timezone=True), nullable=False, server_default=func.now()),
)
