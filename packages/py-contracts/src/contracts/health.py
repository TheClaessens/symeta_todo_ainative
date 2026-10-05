"""Health check contract models."""

from typing import Literal

from pydantic import BaseModel, Field


class HealthCheckResponse(BaseModel):
    """Health check response model."""

    status: Literal["healthy", "unhealthy"] = Field(default="healthy")
