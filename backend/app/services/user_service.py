# ═══════════════════════════════════════════════════════
# OJAS Backend — User Service (MongoDB CRUD)
# ═══════════════════════════════════════════════════════

from datetime import datetime
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models import UserProfile, DoshaScores
from app.auth import hash_password


async def get_user_by_uid(db: AsyncIOMotorDatabase, uid: str) -> Optional[dict]:
    return await db["users"].find_one({"uid": uid}, {"_id": 0})


async def get_user_by_email(db: AsyncIOMotorDatabase, email: str) -> Optional[dict]:
    return await db["users"].find_one({"email": email}, {"_id": 0})


async def create_user(
    db: AsyncIOMotorDatabase,
    uid: str,
    name: str,
    email: Optional[str] = None,
    photo_url: Optional[str] = None,
    provider: str = "password",
    password_hash: Optional[str] = None,
) -> dict:
    """Insert a new user document into the users collection."""
    now = datetime.utcnow()
    user_doc = {
        "uid": uid,
        "name": name,
        "email": email,
        "photo_url": photo_url,
        "provider": provider,
        "password_hash": password_hash,   # None for Firebase/OAuth users
        "scores": {"v": 0, "p": 0, "k": 0},
        "dominant_dosha": None,
        "quiz_completed": False,
        "created_at": now,
        "updated_at": now,
        "last_login": now,
    }
    await db["users"].insert_one(user_doc)
    return {k: v for k, v in user_doc.items() if k not in ("_id", "password_hash")}


async def upsert_firebase_user(
    db: AsyncIOMotorDatabase,
    uid: str,
    name: str,
    email: Optional[str],
    photo_url: Optional[str],
    provider: str,
) -> dict:
    """
    Create the user if they don't exist, or update last_login + name/photo if they do.
    Returns the full user document without sensitive fields.
    """
    existing = await get_user_by_uid(db, uid)
    if existing:
        await db["users"].update_one(
            {"uid": uid},
            {"$set": {"last_login": datetime.utcnow(), "name": name or existing["name"], "photo_url": photo_url}},
        )
        return await get_user_by_uid(db, uid)

    return await create_user(db, uid, name or "Seeker", email, photo_url, provider)


async def update_user_scores(
    db: AsyncIOMotorDatabase,
    uid: str,
    scores: DoshaScores,
) -> dict:
    """Persist quiz results for a user."""
    dominant = max({"v": scores.v, "p": scores.p, "k": scores.k}, key=lambda k: {"v": scores.v, "p": scores.p, "k": scores.k}[k])
    await db["users"].update_one(
        {"uid": uid},
        {
            "$set": {
                "scores": scores.model_dump(),
                "dominant_dosha": dominant,
                "quiz_completed": True,
                "updated_at": datetime.utcnow(),
            }
        },
    )
    return await get_user_by_uid(db, uid)


async def update_user_profile(
    db: AsyncIOMotorDatabase,
    uid: str,
    name: Optional[str] = None,
) -> dict:
    """Update user profile fields."""
    update = {"updated_at": datetime.utcnow()}
    if name:
        update["name"] = name
    await db["users"].update_one({"uid": uid}, {"$set": update})
    return await get_user_by_uid(db, uid)
