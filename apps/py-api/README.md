# FastAPI Minimal (Turborepo Compatible)

A minimal FastAPI application using modern Python tooling and best practices, integrated with Turborepo monorepo workflow.

## Features

- FastAPI with async/await support
- Modern Python with type hints
- uv for ultra-fast package management
- Ruff for linting and formatting
- MyPy for static type checking
- Pytest for testing
- **Turborepo integration** with standard npm scripts
- Structured project layout

## Turborepo Integration

This Python app integrates seamlessly with your Turborepo monorepo:

```bash
# From monorepo root - these work just like your TS packages
turbo dev          # Starts FastAPI dev server
turbo build        # No-op for Python (outputs message)
turbo test         # Runs pytest
turbo lint         # Runs ruff check
turbo format       # Runs ruff format
turbo type-check   # Runs mypy
```

### Package-specific commands:

```bash
# Run only this package
turbo dev --filter=@myorg/fastapi-minimal
turbo test --filter=@myorg/fastapi-minimal

# Or from this directory
npm run dev
npm run test
npm run lint
npm run format
```

## Quick Start

### Prerequisites

Install [uv](https://github.com/astral-sh/uv):

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Setup

1. Install Python dependencies:

```bash
npm run install  # or directly: uv sync
```

2. Start development server:

```bash
npm run dev      # or directly: uv run uvicorn app.main:app --reload
```

The API will be available at:

- Main app: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Development Workflow

All commands follow Turborepo conventions:

```bash
# Development
npm run dev                    # Start dev server with hot reload

# Testing
npm run test                   # Run all tests
npm run test:watch             # Run tests in watch mode

# Code Quality
npm run lint                   # Check for linting errors
npm run lint:fix               # Fix auto-fixable linting errors
npm run format                 # Format code
npm run format:check           # Check if code is formatted
npm run type-check             # Run type checking

# Maintenance
npm run clean                  # Clean Python cache files
```
# Docker

In order to build the application in a container, you can use the following command from the **root** of the monorepo:

```bash
docker build . -f apps/py-api/Dockerfile -t <image-name>
```

To run the application in a container, you can use the following command:

```bash
docker run -p 8000:8000 <image-name>
```