# RIVALRY 90 — External API Architecture (Phase 22)

## Server-Side Proxy Pattern
All external HTTP API calls remain strictly server-side inside `src/services/external/*` and `src/lib/integrations/*`, exposed to the frontend exclusively through RIVALRY 90 `/api/football/*`, `/api/ai/*`, `/api/integrations/status`, and `/api/admin/integrations` Route Handlers. Browser bundles receive zero secret keys or upstream auth headers.

## Core Modules
- [httpClient.js](file:///D:/GAMING/src/lib/integrations/httpClient.js): `fetchWithReliability()` with `AbortController` timeouts, `429`/`401`/`403` no-retry rules, bounded retry on idempotent `GET` transient failures, and secret-free structured error logging.
- [integrationErrors.js](file:///D:/GAMING/src/lib/integrations/integrationErrors.js): Normalizes upstream HTTP codes into safe `ExternalIntegrationError` responses.
- [integrationRegistry.js](file:///D:/GAMING/src/lib/integrations/integrationRegistry.js): Tracks runtime env configuration presence, enable/disable toggles, and last verified probe status without fabricating `"connected"` states.

