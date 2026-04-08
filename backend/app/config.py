# ═══════════════════════════════════════════════════════
# OJAS Backend — Config & Settings
# ═══════════════════════════════════════════════════════

from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    # MongoDB
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "ojas_db"

    # Firebase
    firebase_credentials_path: str = "sadrfaqr-firebase-adminsdk-fbsvc-ad5614a85f.json"

    # JWT
    jwt_secret_key: str = "ojas-super-secret-key-change-in-production-2024"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 10080  # 7 days

    # Session
    session_secret_key: str = "ojas-session-secret-key-change-in-production"

    # CORS
    frontend_url: str = "http://localhost:5173"

    # App
    app_env: str = "development"
    app_port: int = 8000

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
