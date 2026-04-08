# ═══════════════════════════════════════════════════════
# OJAS Backend — Session Service (MongoDB-backed)
# ═══════════════════════════════════════════════════════

import secrets
from datetime import datetime, timedelta
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorDatabase


async def create_session(
    db: AsyncIOMotorDatabase,
    uid: str,
    ttl_hours: int = 168,  # 7 days
) -> str:
    """Create a new server-side session and return the session_id."""
    session_id = secrets.token_urlsafe(48)
    now = datetime.utcnow()
    expires_at = now + timedelta(hours=ttl_hours)

    await db["sessions"].insert_one({
        "session_id": session_id,
        "uid": uid,
        "created_at": now,
        "expires_at": expires_at,
        "data": {},  # arbitrary session data
    })
    return session_id


async def get_session(
    db: AsyncIOMotorDatabase,
    session_id: str,
) -> Optional[dict]:
    """Look up a session by ID. Returns None if expired/missing."""
    session = await db["sessions"].find_one(
        {"session_id": session_id, "expires_at": {"$gt": datetime.utcnow()}},
        {"_id": 0},
    )
    return session


async def update_session_data(
    db: AsyncIOMotorDatabase,
    session_id: str,
    data: dict,
) -> bool:
    """Merge additional data into the session."""
    result = await db["sessions"].update_one(
        {"session_id": session_id},
        {"$set": {f"data.{k}": v for k, v in data.items()}},
    )
    return result.modified_count > 0


async def delete_session(
    db: AsyncIOMotorDatabase,
    session_id: str,
) -> bool:
    """Delete a session (logout)."""
    result = await db["sessions"].delete_one({"session_id": session_id})
    return result.deleted_count > 0


async def delete_all_user_sessions(
    db: AsyncIOMotorDatabase,
    uid: str,
) -> int:
    """Delete all sessions for a user (logout everywhere)."""
    result = await db["sessions"].delete_many({"uid": uid})
    return result.deleted_count
