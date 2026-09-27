FROM python:3.12-slim
WORKDIR /app
COPY api /app
COPY data /data
RUN pip install --no-cache-dir uv && uv sync --frozen
EXPOSE 8000
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
