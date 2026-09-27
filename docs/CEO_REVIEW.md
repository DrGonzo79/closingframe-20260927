# CEO Review

Status: DONE · Mode: SCOPE REDUCTION

## Nuclear challenge and alternatives

The original “analytics tool” is too broad and competes on dashboards. The business outcome is defended marketing spend. The minimal concierge report, evidence-led workspace, and full growth OS were compared in `OFFICE_HOURS.md`; the review chooses the workspace-shaped prototype but limits the paid wedge to one weekly report and one connector pair. Current state → contested view metrics → inspectable outcome evidence → 12-month ideal of trusted creative experiments across ten brokerages.

## 1. Architecture
Keep deterministic attribution behind one API boundary. Static demo parity is intentional, not a second production engine. Production needs versioned runs and connector isolation; no autonomous agent is required.

## 2. Error and rescue map
422 covers malformed IDs/windows/models; 404 names missing listings; 409 names an empty evidence window. Future connector auth expiry, timeout, schema drift and duplicate events must each surface distinct run states, remediation and last-good data.

## 3. Security and threat model
CRM/MLS data can include PII and transaction values. Require tenant isolation, least-privilege OAuth, encrypted tokens, audit logs, retention controls, formula-safe exports and no protected-class inference. Demo contains no real people or properties.

## 4. Data flow and interaction edges
Input → validated listing/window/model → event filter → video grouping → scoring → evidence rows. Nil/wrong/range failures stop before compute; empty outcomes produce a visible error. Repeated clicks are disabled during compute; changing inputs clears stale results; clipboard denial is visible.

## 5. Code quality
Shared fixtures make calculations reviewable. The client intentionally mirrors backend behavior only for a serverless demo. Extract a generated client from the API contract before production to prevent drift.

## 6. Tests
Python tests cover success, close exclusion, unknown listing, invalid window and invalid model. Playwright covers primary attribution, evidence inspection, copy, reset, validation and mobile overflow. Connector contract and idempotency tests are deferred with connectors.

## 7. Observability
Production must measure run success/duration, source freshness, matched-event ratio, manual correction rate and report-open rate. Alert on auth expiry, >25% match-rate drop and stale scheduled reports; keep a connector-disable runbook.

## 8. Database and state
No database in the prototype. Production requires immutable source events, tenant/listing indexes, unique source idempotency keys and versioned credits. Corrections append; they never rewrite history silently.

## 9. API contract
The endpoint is small, typed and versionable. Before external clients, add `/v1`, request IDs, pagination for evidence, rate limits and structured error codes.

## 10. Performance and scale
Fixture scans are trivial. At 10×, index by tenant/listing/time. At 100×, partition source events and run attribution asynchronously; do not compute across an entire brokerage in a synchronous request.

## 11. Design and UX
Hierarchy leads with outcome, then controls, linked metrics, evidence and next action. Empty/loading/error states, keyboard focus and responsive layouts are present. Production needs source freshness, competing touches and correction workflows before confidence is trustworthy.

## Decisions

- **Strongest challenges:** unproven demand, unreliable identity joins, and causal overclaiming.
- **Accepted:** one-listing attribution run, inspectable evidence, broker-ready summary, tested API.
- **Deferred:** live connectors, multi-touch graph, warehouse, benchmarks and AI recommendations until paid validation.
- **Not in scope:** full social suite, content generation, billable hosting, autonomous budget decisions.
