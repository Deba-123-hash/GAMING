# RIVALRY 90 — External API Security Controls

1. **Zero Browser Key Exposure:** `FOOTBALL_DATA_API_KEY`, `GEMINI_API_KEY`, `RESEND_API_KEY`, `YOUTUBE_API_KEY`, and `CLOUDINARY_API_SECRET` have zero `NEXT_PUBLIC_` prefixes and execute only inside server Route Handlers.
2. **Header-Based Auth & Clean Logs:** Gemini calls transmit `x-goog-api-key` via HTTP headers rather than query strings so API keys never appear in proxy URL logs.
3. **RBAC & Rate Limits:** All `/api/ai/*` routes require `r90_session` authentication and per-user rate limits; `/api/admin/integrations` enforces `analytics.read` (`GET`) and `settings.manage` (`POST`).
4. **Honest Status Verification:** Admin UI (`/admin/integrations`) and `GET /api/integrations/status` never fake `"connected"` without a verified probe response (`lastStatus === 'connected'`).
5. **No Automatic Retries on Auth Errors:** `401`, `403`, and `429` never enter retry loops.

