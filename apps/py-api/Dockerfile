# syntax=docker/dockerfile:1

# This Dockerfile builds a container image for the translation word worker service.
# It uses a multi-stage build pattern:
# 1. Build stage: Installs Python dependencies using UV package manager
# 2. Runtime stage: Creates minimal runtime image with only required dependencies

FROM python:3.13-slim AS build

ENV PIP_CACHE_DIR=/tmp/pip-cache

# Install UV package manager with caching
# hadolint ignore=DL3042
RUN --mount=type=cache,target=/tmp/pip-cache \
    pip install uv==0.8.14

# Configure UV environment variables
ENV UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1 \
    UV_PYTHON_DOWNLOADS=never \
    UV_PYTHON=/usr/local/bin/python3.13 \
    UV_PROJECT_ENVIRONMENT=/app

# Install dependencies for workspace packages
RUN --mount=type=cache,target=/root/.cache \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    --mount=type=bind,source=apps/py-api/pyproject.toml,target=apps/py-api/pyproject.toml \
    uv sync \
        --project apps/py-api/ \
        --frozen \
        --no-dev \
        --no-install-workspace

# Copy source code
COPY ./ /src/
WORKDIR /src

# Install application and its dependencies
RUN --mount=type=cache,target=/root/.cache \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync \
        --project apps/py-api/ \
        --frozen \
        --no-dev \
        --no-editable

#####################
# Runtime stage
FROM python:3.13-slim AS runtime

expose 8000

# Configure Python to run in unbuffered mode
ENV PYTHON_UNBUFFERED=1

# Add application binaries to PATH
ENV PATH=/app/bin:$PATH

# Create a non-root user for security
RUN groupadd -r app \
    && useradd -r -d /app -g app -N app

# Copy installed packages from build stage
COPY --from=build --chown=app:app /app /app
COPY apps/py-api/src/ /app/src/

# Switch to non-root user
USER app
WORKDIR /app/src

# Run the fastapi app
ENTRYPOINT ["fastapi", "run"]
