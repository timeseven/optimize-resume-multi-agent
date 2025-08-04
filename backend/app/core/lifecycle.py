from fastapi import FastAPI

from app.core.database import database


async def init_resources(app: FastAPI):
    try:
        # Connect to DB
        database.connect()
        print("✅ DB connected")
    except Exception as e:
        print(f"❌ Failed to init DB: {e}")


async def shutdown_resources(app: FastAPI):
    try:
        await database.disconnect()
        print("✅ DB closed")
    except Exception as e:
        print(f"DB close failed: {e}")
