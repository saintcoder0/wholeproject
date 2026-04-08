# ═══════════════════════════════════════════════════════
# OJAS Backend — Pydantic Models
# ═══════════════════════════════════════════════════════

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
from datetime import datetime


# ── Auth ──────────────────────────────────────────────

class FirebaseLoginRequest(BaseModel):
    """Client sends the Firebase ID token obtained after Google/Email sign-in."""
    id_token: str


class EmailPasswordRegister(BaseModel):
    """Traditional email+password registration."""
    name: str = Field(..., min_length=1, max_length=80)
    email: EmailStr
    password: str = Field(..., min_length=6)


class EmailPasswordLogin(BaseModel):
    """Traditional email+password login (we validate against our DB)."""
    email: EmailStr
    password: str


# ── User ──────────────────────────────────────────────

class DoshaScores(BaseModel):
    v: int = 0  # Vata
    p: int = 0  # Pitta
    k: int = 0  # Kapha


class UserProfile(BaseModel):
    uid: str
    name: str
    email: Optional[str] = None
    photo_url: Optional[str] = None
    provider: str = "password"         # "password" | "google.com" | etc.
    scores: DoshaScores = DoshaScores()
    dominant_dosha: Optional[str] = None  # "v", "p", or "k"
    quiz_completed: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: datetime = Field(default_factory=datetime.utcnow)


class UserPublic(BaseModel):
    """What we return to the frontend (no sensitive fields)."""
    uid: str
    name: str
    email: Optional[str] = None
    photo_url: Optional[str] = None
    provider: str
    scores: DoshaScores
    dominant_dosha: Optional[str] = None
    quiz_completed: bool
    created_at: datetime
    last_login: datetime


class UpdateProfileRequest(BaseModel):
    """Update user name."""
    name: Optional[str] = Field(None, min_length=1, max_length=80)


class SaveResultsRequest(BaseModel):
    """Save quiz results for the current user."""
    scores: DoshaScores


# ── Session ───────────────────────────────────────────

class SessionData(BaseModel):
    session_id: str
    uid: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime


# ── Responses ─────────────────────────────────────────

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class MessageResponse(BaseModel):
    message: str
    detail: Optional[Any] = None
