"""Test main application."""

from app.main import APP
from fastapi.testclient import TestClient

client = TestClient(APP)


def test_root() -> None:
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert "description" in data
    assert "version" in data
    assert "status" in data
    assert "docs_url" in data
    assert data["status"] == "running"


def test_health_check() -> None:
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "healthy"
