# OJAS Backend — FastAPI + Firebase + MongoDB

A production-ready backend API for the OJAS Ayurvedic Prakriti Analyser.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| **Framework** | FastAPI |
| **Package Manager** | uv |
| **Auth** | Firebase Admin SDK + JWT |
| **Database** | MongoDB (via Motor async driver) |
| **Sessions** | Server-side MongoDB sessions with TTL |
| **Password Hashing** | bcrypt via passlib |

## Quick Start

### Prerequisites

1. **Python 3.11+** installed
2. **MongoDB** running locally (default: `mongodb://localhost:27017`)
3. **uv** package manager (auto-installs if not present)

### Install & Run

```powershell
# Navigate to backend
cd backend

# Install dependencies (creates .venv automatically)
uv sync

# Start the server (development with hot-reload)
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Verify

- **Health Check:** http://localhost:8000/
- **API Docs:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## API Endpoints

### Authentication (`/api/auth`)

| Method | Path | Description | Auth Required |
|--------|------|------------|:---:|
| `POST` | `/api/auth/firebase` | Login via Firebase ID token | ❌ |
| `POST` | `/api/auth/register` | Register with email/password | ❌ |
| `POST` | `/api/auth/login` | Login with email/password | ❌ |
| `POST` | `/api/auth/logout` | Logout (delete session) | ✅ |
| `POST` | `/api/auth/logout-all` | Logout all devices | ✅ |
| `GET`  | `/api/auth/me` | Get current user | ✅ |

### User (`/api/user`)

| Method | Path | Description | Auth Required |
|--------|------|------------|:---:|
| `GET` | `/api/user/profile` | Get user profile | ✅ |
| `PATCH` | `/api/user/profile` | Update display name | ✅ |
| `POST` | `/api/user/results` | Save quiz results | ✅ |
| `GET` | `/api/user/results` | Get saved results | ✅ |

## Project Structure

```
backend/
├── main.py                    # FastAPI entry point
├── pyproject.toml             # uv project config
├── .env                       # Environment variables
├── sadrfaqr-firebase-*.json   # Firebase service account key
└── app/
    ├── config.py              # Pydantic Settings
    ├── firebase.py            # Firebase Admin SDK init
    ├── database.py            # Motor MongoDB connection
    ├── models.py              # Pydantic data models
    ├── auth.py                # JWT + password utilities
    ├── routes/
    │   ├── auth_routes.py     # Auth endpoints
    │   └── user_routes.py     # User CRUD endpoints
    └── services/
        ├── user_service.py    # User MongoDB CRUD
        └── session_service.py # Session management
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=ojas_db
FIREBASE_CREDENTIALS_PATH=sadrfaqr-firebase-adminsdk-fbsvc-ad5614a85f.json
JWT_SECRET_KEY=change-this-in-production
SESSION_SECRET_KEY=change-this-too
FRONTEND_URL=http://localhost:5173
```

## MongoDB Setup

If you don't have MongoDB installed:

1. Download from https://www.mongodb.com/try/download/community
2. Install and start the `mongod` service
3. The backend will auto-create the `ojas_db` database and required indexes
