# ═══════════════════════════════════════════════════════
# OJAS Backend — MongoDB Connection (Motor async)
# ═══════════════════════════════════════════════════════

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import get_settings
from typing import Optional

_client: Optional[AsyncIOMotorClient] = None
_db: Optional[AsyncIOMotorDatabase] = None


async def connect_db():
    """Create MongoDB connection on startup."""
    global _client, _db
    settings = get_settings()

    try:
        _client = AsyncIOMotorClient(
            settings.mongodb_url,
            serverSelectionTimeoutMS=5000,  # 5-second timeout
        )
        _db = _client[settings.mongodb_db_name]

        # Simple ping to verify connection
        await _db.command("ping")
        print(f"✅ MongoDB connected: {settings.mongodb_url} → {settings.mongodb_db_name}")

        # Create indexes
        await _db["users"].create_index("uid", unique=True)
        await _db["users"].create_index("email", unique=True, sparse=True)
        await _db["sessions"].create_index("session_id", unique=True)
        await _db["sessions"].create_index(
            "expires_at",
            expireAfterSeconds=0  # TTL index — MongoDB auto-deletes expired sessions
        )
        print("✅ MongoDB indexes created")

    except Exception as e:
        print(f"⚠️  MongoDB connection failed: {e}")
        print(f"⚠️  Server will start but database operations will fail.")
        print(f"⚠️  Make sure MongoDB is running at: {settings.mongodb_url}")
        # Still set _db so the app can start — requests will fail with clear errors
        if _client:
            _db = _client[settings.mongodb_db_name]


async def close_db():
    """Close MongoDB connection on shutdown."""
    global _client
    if _client:
        _client.close()
        print("MongoDB connection closed")


def get_db() -> AsyncIOMotorDatabase:
    """Return the active database instance."""
    if _db is None:
        raise RuntimeError(
            "Database not connected. Make sure MongoDB is running and call connect_db() first."
        )
    return _db
