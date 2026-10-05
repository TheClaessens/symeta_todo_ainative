"""Health check router."""

from app.config.settings import get_settings
from contracts.core import ApiInfoResponse
from fastapi import APIRouter

SETTINGS = get_settings()

router = APIRouter(
    tags=["root"],
)


@router.get("/")
async def root() -> ApiInfoResponse:
    """Root endpoint that returns basic API information."""
    return ApiInfoResponse(
        name=SETTINGS.name,
        description=SETTINGS.description,
        version=SETTINGS.version,
        status="running",
        docs_url=SETTINGS.docs_url,
    )
