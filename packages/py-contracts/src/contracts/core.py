"""Core contract models."""

from typing import Optional

from pydantic import BaseModel, Field


class ApiInfoResponse(BaseModel):
    """API information response model."""

    name: str = Field(description="The API name")
    description: str = Field(description="The API description")
    version: str = Field(description="The API version")
    status: str = Field(default="running", description="The API status")
    docs_url: Optional[str] = Field(default=None, description="URL to API documentation")
