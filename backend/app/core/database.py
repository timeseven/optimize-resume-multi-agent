from sqlalchemy import event
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine

from app.core.config import settings


class Database:
    def __init__(self):
        self._engine: AsyncEngine | None = None

    def connect(self):
        self._engine = create_async_engine(
            str(settings.DATABASE_URL),
            echo=settings.ECHO,
        )

        if "sqlite" in str(settings.DATABASE_URL):

            @event.listens_for(self._engine.sync_engine, "connect")
            def enable_sqlite_foreign_keys(dbapi_connection, connection_record):
                cursor = dbapi_connection.cursor()
                cursor.execute("PRAGMA foreign_keys=ON;")
                cursor.close()

    async def disconnect(self):
        if self._engine:
            await self._engine.dispose()
            self._engine = None

    def get_engine(self) -> AsyncEngine:
        if not self._engine:
            raise RuntimeError("Database engine not initialized. Call create_engine first.")
        return self._engine


database = Database()
