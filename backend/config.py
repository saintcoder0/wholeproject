from pydantic_settings import BaseSettings, SettingsConfigDict
from motor.motor_asyncio import AsyncIOMotorClient
import firebase_admin
from firebase_admin import credentials

class Settings(BaseSettings):
    mongodb_uri: str = "mongodb://localhost:27017"
    firebase_credentials_path: str = "./firebase_service_account.json"
    database_name: str = "ojas_db"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()

# Motor async client for MongoDB
# tlsAllowInvalidCertificates bypasses certificate verification.
# The SECLEVEL=1 cipher fix is applied via openssl.cfg + OPENSSL_CONF (see run.ps1).
client = AsyncIOMotorClient(
    settings.mongodb_uri,
    tls=True,
    tlsAllowInvalidCertificates=True,
)
db = client[settings.database_name]
users_collection = db["users"]

# Initialize Firebase Admin SDK
try:
    if not firebase_admin._apps:
        cred = credentials.Certificate(settings.firebase_credentials_path)
        firebase_admin.initialize_app(cred)
        print("Firebase Admin initialized successfully.")
except Exception as e:
    print(f"Warning: Firebase Admin failed to initialize. Ensure {settings.firebase_credentials_path} exists and is valid.")
    print(f"Error details: {e}")
