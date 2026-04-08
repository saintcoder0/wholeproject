# ═══════════════════════════════════════════════════════
# OJAS Backend — JWT + Auth Utilities
# ═══════════════════════════════════════════════════════

from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import get_settings

settings = get_settings()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Bearer token extractor
bearer_scheme = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(uid: str, expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed JWT for the given user UID."""
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    )
    payload = {"sub": uid, "exp": expire, "iat": datetime.utcnow()}
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> str:
    """Decode JWT and return uid (subject). Raises HTTPException on failure."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm]
        )
        uid: str = payload.get("sub")
        if uid is None:
            raise credentials_exception
        return uid
    except JWTError:
        raise credentials_exception


# ── FastAPI dependency for protected routes ─────────────

async def get_current_user_uid(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> str:
    """FastAPI dependency: extract and validate JWT, return uid."""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return decode_access_token(credentials.credentials)
