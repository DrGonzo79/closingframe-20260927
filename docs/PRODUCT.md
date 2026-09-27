# Product plan

## ICP and job

**ICP:** marketing director or operations lead at a 25–150-agent residential brokerage publishing at least 20 listing videos/month and using a mainstream CRM. **JTBD:** “When the broker-owner reviews social spend, show which listing videos influenced leads, showings and commissions so I can fund the next shoot with evidence.”

## MVP

1. Map video → listing using explicit IDs and review exceptions.
2. Import timestamped lead, showing and close events.
3. Apply a configurable attribution window and transparent scoring model.
4. Rank hooks/formats and produce an evidence-backed broker report.

The prototype implements steps 3–4 over shared fictional fixtures and a tested FastAPI endpoint. It labels correlation, uncertainty, and deployment boundaries.

## Data model

- `Listing(id, address, price, status, closed_revenue)`
- `Video(id, listing_id, platform_id, hook, format, duration, published_at, views, saves)`
- `Outcome(id, listing_id, video_id?, type, occurred_at, value, source)`
- `AttributionRun(id, listing_id, window_days, model_version, status, confidence)`
- `Credit(run_id, video_id, outcome_id, score, reason)`

Production requires unique platform IDs, source-event idempotency keys, tenant isolation and immutable run versions.

## Architecture and AI strategy

Next.js provides the analyst workflow and a static demo. FastAPI owns validation and deterministic attribution. Production adds connector workers, Postgres and a queue. Start without an LLM: deterministic joins are easier to audit. Later, use a model only to cluster creative features and draft recommendations from already-attributed evidence; never let it invent matches.

## Economics

Target $750/month for one CRM + one channel, $1,500/month with managed reconciliation. A 50-agent brokerage closing 50 sides/month needs only one protected production decision or one incremental lead-to-close to justify the spend. Gross margin can exceed 80% after connectors stabilize; onboarding and exception review are the early margin risk.

## Validation and GTM

- Founder-led outreach to 30 brokerage marketing directors showing broker-report screenshots, not a generic dashboard.
- Concierge-reconcile three historical months; charge before building connectors.
- Gate: ≥3/10 qualified calls provide exports, ≥2 pay, median unmatched-event rate <25%, and at least one changes spend or creative.
- Land with the monthly broker report; expand to team benchmarks and controlled creative experiments.

## Moat

The dashboard is not a moat. Defensibility comes from a brokerage-specific identity graph, corrected mappings, model-version history, cross-brokerage privacy-safe creative benchmarks, and workflow trust earned through explainable credit.

## Risks

- Platform/MLS access changes → begin with customer-owned exports and CRM links.
- Correlation presented as causation → evidence drawer, model version, competing-touch attribution and confidence.
- Dirty agent data → exception queue and confidence floor.
- Long sales cycles → paid concierge report before integration.
- Fair-housing and privacy exposure → no protected-class inference; minimize PII and log access.

## 30 / 60 / 90 days

- **30:** three paid concierge reports, schema mapping for one CRM, quantify unmatched data.
- **60:** production connector for one CRM and TikTok exports, exception queue, scheduled broker report, audit log.
- **90:** ten paying brokerages, retention interview, controlled content experiment, decide whether to deepen the CRM wedge or stop.
