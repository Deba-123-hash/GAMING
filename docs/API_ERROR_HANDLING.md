# RIVALRY 90 — API Error Handling

- All `/api/*` handlers funnel exceptions through `handleApiError(err, { requestId, endpoint })` (`src/server/utils/errorHandler.js`).
- `ApiError`, PostgreSQL `normalizeDatabaseError()` results, and `ExternalIntegrationError` preserve exact HTTP status codes (`400`, `401`, `403`, `404`, `409`, `429`, `502`, `503`, `504`) alongside standardized `{ success: false, ok: false, message, error: { code, details }, meta: { requestId } }` JSON.
- Unexpected errors log structured server telemetry with secret redaction (`sanitizeLogMeta`) and return a safe generic `500 INTERNAL_SERVER_ERROR` without exposing stack traces or raw SQL.

