# ═══════════════════════════════════════════════════════
# OJAS Backend — User Routes
# Profile + Quiz Results
# ═══════════════════════════════════════════════════════

from fastapi import APIRouter, HTTPException, Depends

from app.models import (
    UserPublic,
    UpdateProfileRequest,
    SaveResultsRequest,
    MessageResponse,
)
from app.auth import get_current_user_uid
from app.database import get_db
from app.services.user_service import (
    get_user_by_uid,
    update_user_profile,
    update_user_scores,
)

router = APIRouter(prefix="/api/user", tags=["User"])


# ── Get Profile ───────────────────────────────────────

@router.get("/profile", response_model=UserPublic)
async def get_profile(uid: str = Depends(get_current_user_uid)):
    """Get the authenticated user's full profile."""
    db = get_db()
    user = await get_user_by_uid(db, uid)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserPublic(**user)


# ── Update Profile ────────────────────────────────────

@router.patch("/profile", response_model=UserPublic)
async def patch_profile(
    body: UpdateProfileRequest,
    uid: str = Depends(get_current_user_uid),
):
    """Update the user's display name."""
    db = get_db()
    user = await update_user_profile(db, uid, name=body.name)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserPublic(**user)


# ── Save Quiz Results ─────────────────────────────────

@router.post("/results", response_model=UserPublic)
async def save_results(
    body: SaveResultsRequest,
    uid: str = Depends(get_current_user_uid),
):
    """Save Prakriti quiz results (Vata/Pitta/Kapha scores)."""
    db = get_db()
    user = await update_user_scores(db, uid, body.scores)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserPublic(**user)


# ── Get Results ───────────────────────────────────────

@router.get("/results")
async def get_results(uid: str = Depends(get_current_user_uid)):
    """Get saved quiz results and dominant dosha."""
    db = get_db()
    user = await get_user_by_uid(db, uid)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "scores": user.get("scores", {"v": 0, "p": 0, "k": 0}),
        "dominant_dosha": user.get("dominant_dosha"),
        "quiz_completed": user.get("quiz_completed", False),
    }
