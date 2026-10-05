"""Main FastAPI application."""

from app.config.settings import get_settings
from app.routers import health, root
from fastapi import FastAPI

# Load settings from environment variables
SETTINGS = get_settings()

APP = FastAPI(
    title=SETTINGS.name,
    description=SETTINGS.description,
    version=SETTINGS.version,
    docs_url=SETTINGS.docs_url,
    redoc_url=SETTINGS.redoc_url,
    debug=SETTINGS.debug,
)

# Include routers
APP.include_router(root.router)
APP.include_router(health.router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(APP, host=SETTINGS.host, port=SETTINGS.port)
