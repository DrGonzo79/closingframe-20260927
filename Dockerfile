FROM python:3.12-slim
# Refresh the system certificate store when rebuilding this image.
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates \
 && update-ca-certificates \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY api /app
COPY data /data
RUN pip install --no-cache-dir uv && uv sync --frozen 'certifi>=2026.10.19'
EXPOSE 8000
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
