# py-api

- Managed with uv: from the repo root, `uv run --project apps/py-api ...`; `package.json` scripts wrap dev, test (pytest), lint/format (ruff) and type-check (mypy).
- Configuration through Pydantic settings in `src/app/config/settings.py`.
- Request/response models are Pydantic; models shared with other services live in `packages/py-contracts`.
- Put CLI- or dev-only packages in dependency groups/extras, not main dependencies.
