# ═══════════════════════════════════════════════════════
# OJAS Backend — FastAPI Application Entry Point
# ═══════════════════════════════════════════════════════

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import connect_db, close_db
from app.firebase import init_firebase
from app.routes.auth_routes import router as auth_router
from app.routes.user_routes import router as user_router


settings = get_settings()


# ── Lifespan: startup / shutdown ─────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Runs on startup and shutdown."""
    # Startup
    print("═" * 50)
    print("   🪷  OJAS Backend — Starting Up")
    print("═" * 50)
    init_firebase()
    await connect_db()
    print(f"   🌐  CORS allowed: {settings.frontend_url}")
    print(f"   🚀  Server running on port {settings.app_port}")
    print("═" * 50)

    yield

    # Shutdown
    await close_db()
    print("🪷  OJAS Backend — Shut Down")


# ── Create App ────────────────────────────────────────

app = FastAPI(
    title="OJAS — Prakriti Analyser API",
    description="Backend API for the OJAS Ayurvedic Prakriti Analyser. "
                "Handles Firebase auth, user sessions, and quiz result persistence.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)


# ── CORS Middleware ───────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:5173",
        "http://localhost:4173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Register Routers ─────────────────────────────────

app.include_router(auth_router)
app.include_router(user_router)


# ── Health Check ──────────────────────────────────────

@app.get("/", tags=["Health"])
async def root():
    return {
        "app": "OJAS — Prakriti Analyser API",
        "status": "healthy",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/api/health", tags=["Health"])
async def health_check():
    from app.database import get_db
    db = get_db()
    try:
        await db.command("ping")
        db_status = "connected"
    except Exception:
        db_status = "disconnected"

    return {
        "status": "ok",
        "database": db_status,
        "firebase": "initialized",
    }


# ── Run (for `python main.py` convenience) ────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.app_port,
        reload=settings.app_env == "development",
    )
