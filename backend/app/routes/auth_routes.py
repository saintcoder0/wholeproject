# ═══════════════════════════════════════════════════════
# OJAS Backend — Auth Routes
# Firebase login + Email/Password auth
# ═══════════════════════════════════════════════════════

from fastapi import APIRouter, HTTPException, status, Depends, Response, Cookie
from typing import Optional

from app.models import (
    FirebaseLoginRequest,
    EmailPasswordRegister,
    EmailPasswordLogin,
    AuthResponse,
    UserPublic,
    MessageResponse,
)
from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user_uid,
)
from app.firebase import verify_firebase_token
from app.database import get_db
from app.services.user_service import (
    get_user_by_uid,
    get_user_by_email,
    create_user,
    upsert_firebase_user,
)
from app.services.session_service import (
    create_session,
    delete_session,
    delete_all_user_sessions,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# ── Firebase Login (Google / any provider) ────────────

@router.post("/firebase", response_model=AuthResponse)
async def firebase_login(body: FirebaseLoginRequest, response: Response):
    """
    Client sends Firebase ID token after signing in via Firebase SDK.
    We verify it, upsert the user in MongoDB, create a JWT + session.
    """
    try:
        decoded = await verify_firebase_token(body.id_token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Firebase token: {str(e)}",
        )

    uid = decoded["uid"]
    email = decoded.get("email")
    name = decoded.get("name") or decoded.get("email", "Seeker")
    photo = decoded.get("picture")
    provider = decoded.get("firebase", {}).get("sign_in_provider", "firebase")

    db = get_db()
    user = await upsert_firebase_user(db, uid, name, email, photo, provider)

    # Create JWT
    access_token = create_access_token(uid)

    # Create server session
    session_id = await create_session(db, uid)
    response.set_cookie(
        key="ojas_session",
        value=session_id,
        httponly=True,
        max_age=7 * 24 * 60 * 60,  # 7 days
        samesite="lax",
    )

    return AuthResponse(
        access_token=access_token,
        user=UserPublic(**user),
    )


# ── Email + Password Register ────────────────────────

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(body: EmailPasswordRegister, response: Response):
    """Register a new user with email and password (stored in MongoDB)."""
    db = get_db()

    existing = await get_user_by_email(db, body.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    # UID for local users: "local_" + sanitized email
    uid = f"local_{body.email.replace('@', '_at_').replace('.', '_')}"

    hashed = hash_password(body.password)
    user = await create_user(
        db,
        uid=uid,
        name=body.name,
        email=body.email,
        provider="password",
        password_hash=hashed,
    )

    access_token = create_access_token(uid)
    session_id = await create_session(db, uid)
    response.set_cookie(
        key="ojas_session",
        value=session_id,
        httponly=True,
        max_age=7 * 24 * 60 * 60,
        samesite="lax",
    )

    return AuthResponse(
        access_token=access_token,
        user=UserPublic(**user),
    )


# ── Email + Password Login ───────────────────────────

@router.post("/login", response_model=AuthResponse)
async def login(body: EmailPasswordLogin, response: Response):
    """Login with email + password."""
    db = get_db()

    user = await get_user_by_email(db, body.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # Firebase/OAuth users don't have a password_hash
    if not user.get("password_hash"):
        provider = user.get("provider", "unknown")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"This account uses {provider} login. Please sign in with that provider.",
        )

    if not verify_password(body.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    uid = user["uid"]
    access_token = create_access_token(uid)
    session_id = await create_session(db, uid)
    response.set_cookie(
        key="ojas_session",
        value=session_id,
        httponly=True,
        max_age=7 * 24 * 60 * 60,
        samesite="lax",
    )

    return AuthResponse(
        access_token=access_token,
        user=UserPublic(**user),
    )


# ── Logout ────────────────────────────────────────────

@router.post("/logout", response_model=MessageResponse)
async def logout(
    response: Response,
    ojas_session: Optional[str] = Cookie(None),
    uid: str = Depends(get_current_user_uid),
):
    """Logout: delete session cookie + server session."""
    db = get_db()
    if ojas_session:
        await delete_session(db, ojas_session)
    response.delete_cookie("ojas_session")
    return MessageResponse(message="Logged out successfully")


@router.post("/logout-all", response_model=MessageResponse)
async def logout_all(
    response: Response,
    uid: str = Depends(get_current_user_uid),
):
    """Logout from all devices: delete all sessions for this user."""
    db = get_db()
    count = await delete_all_user_sessions(db, uid)
    response.delete_cookie("ojas_session")
    return MessageResponse(message=f"Logged out from {count} session(s)")


# ── Current User ──────────────────────────────────────

@router.get("/me", response_model=UserPublic)
async def get_me(uid: str = Depends(get_current_user_uid)):
    """Return the currently authenticated user's profile."""
    db = get_db()
    user = await get_user_by_uid(db, uid)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserPublic(**user)
