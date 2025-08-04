from typing import Annotated, AsyncGenerator

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncConnection

from app.core.database import database


async def get_connection() -> AsyncGenerator[AsyncConnection, None]:
    async with database.get_engine().connect() as conn:
        async with conn.begin():
            yield conn


DBConnDep = Annotated[AsyncConnection, Depends(get_connection)]
