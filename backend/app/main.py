from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException

from app.api.clients import router as clients_router
from app.api.dev import router as dev_router
from app.api.posts import router as posts_router
from app.api.settings import router as settings_router
from app.config import get_settings
from app.db.pool import acquire, close_pool, init_pool
from app.logging import configure_logging, get_logger


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    configure_logging()
    logger = get_logger(__name__)
    settings = get_settings()
    try:
        await init_pool()
        logger.info("db.pool.ready")
    except Exception as exc:
        logger.warning("db.pool.unavailable", error=str(exc))
    logger.info("app.startup", env=settings.app_env)
    yield
    await close_pool()
    logger.info("app.shutdown")


app = FastAPI(
    title="VisaoPost API",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(posts_router)
app.include_router(clients_router)
app.include_router(settings_router)

if get_settings().app_env == "dev":
    app.include_router(dev_router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/health/db")
async def health_db() -> dict[str, object]:
    try:
        async with acquire() as conn:
            version = await conn.fetchval("SELECT version()")
            tenants_count = await conn.fetchval("SELECT count(*) FROM tenants")
            holidays_count = await conn.fetchval("SELECT count(*) FROM holidays_br")
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"db unavailable: {exc}") from exc
    return {
        "status": "ok",
        "postgres_version": version,
        "tenants": tenants_count,
        "holidays": holidays_count,
    }
