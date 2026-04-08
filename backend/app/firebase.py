# ═══════════════════════════════════════════════════════
# OJAS Backend — Firebase Initialization
# ═══════════════════════════════════════════════════════

import firebase_admin
from firebase_admin import credentials, auth
from app.config import get_settings
import os

_app = None


def init_firebase():
    """Initialize Firebase Admin SDK (idempotent)."""
    global _app
    if _app is not None:
        return _app

    settings = get_settings()
    cred_path = settings.firebase_credentials_path

    # Resolve relative to project root (where main.py lives)
    if not os.path.isabs(cred_path):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        cred_path = os.path.join(base_dir, cred_path)

    cred = credentials.Certificate(cred_path)
    _app = firebase_admin.initialize_app(cred)
    project_id = cred.service_account_email.split("@")[0] if hasattr(cred, "service_account_email") else "unknown"
    print(f"✅ Firebase initialized (project: {project_id})")
    return _app


async def verify_firebase_token(id_token: str) -> dict:
    """
    Verify a Firebase ID token and return the decoded claims.
    Raises firebase_admin.auth.InvalidIdTokenError on failure.
    """
    decoded = auth.verify_id_token(id_token)
    return decoded


def get_firebase_user(uid: str) -> dict:
    """Fetch Firebase user record by UID."""
    user = auth.get_user(uid)
    return {
        "uid": user.uid,
        "email": user.email,
        "display_name": user.display_name,
        "photo_url": user.photo_url,
        "email_verified": user.email_verified,
        "provider_data": [p.provider_id for p in user.provider_data],
    }
