# ClosingFrame

ClosingFrame is a runnable prototype for real-estate brokerages that want to connect listing-video performance to CRM leads, showings and closed commission. The static demo uses explicit fictional fixtures. The FastAPI service implements the same attribution operation as tested source; it is **not deployed** by GitHub Pages.

## Run

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. Run the backend separately:

```bash
cd api
uv sync --frozen
uv run uvicorn main:app --reload
```

## Verify

```bash
npm run typecheck
npm run test:e2e
npm run build
npm run audit:prod
cd api && uv sync --frozen && uv run pytest
```

## What works

- Select a fictional listing, attribution window and evidence model.
- Compute linked leads, showings, revenue, confidence and ranked creative.
- Inspect video evidence, reset state, validate bad windows and copy a broker report.
- Exercise a real `POST /attribution` domain operation with validation and named failures.

Source inspiration: [Ideabrowser public idea](https://www.ideabrowser.com/hub/ideas/video-marketing-analytics-for-real-estate-brokerages-31270ea8). This repository summarizes the concept and does not reproduce subscriber content.
