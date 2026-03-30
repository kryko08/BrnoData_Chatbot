FROM python:3.14-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

ENV UV_SYSTEM_PYTHON=1 \
    UV_COMPILE_BYTECODE=1 \
    PYTHONUNBUFFERED=1

# Copy dependency files first (better layer caching)
COPY pyproject.toml uv.lock ./

# Install only api package dependencies
RUN uv sync --frozen --no-dev

# Copy source
COPY api/ ./api/

CMD ["uv", "run", "uvicorn", "api.app.main:app", "--host", "0.0.0.0", "--port", "8001", "--reload"]