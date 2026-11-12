# RIVALRY 90 — API Authentication Guide

- Session state is carried exclusively in HMAC-SHA256 signed `HttpOnly; SameSite=Lax` cookie `r90_session` (plus `Secure` when `NODE_ENV=production`).
- Frontend `apiRequest()` (`src/lib/api/apiClient.js`) automatically uses `credentials: 'same-origin'` so cookies attach securely to internal `/api/*` requests without storing tokens in `localStorage`.
- Protected routes invoke `getServerSession(request)` + `assertAuthenticated(session)` on the server, returning `401 UNAUTHORIZED` when missing, expired, revoked, or associated with a suspended/banned account.
- Public & private authenticated routes use `export const dynamic = 'force-dynamic'` and `Cache-Control: no-store` on health/session telemetry so private user state is never cached publicly.

