# Backend Architecture (Phases 11–17)

## Layer Breakdown
1. **Route Handlers (`src/app/api/**/route.js`):** Thin HTTP adapters responsible for rate limiting, session resolution, Zod schema parsing (`parseJsonBody`, `validateWithSchema`), calling domain services, and delegating exceptions to `handleApiError()`.
2. **Validation Layer (`src/server/auth/authValidation.js`, `src/server/validation/domainSchemas.js`, `src/utils/validators.js`):** Strict Zod schemas for every mutation and query boundary.
3. **Domain & Application Services (`src/server/services/*`, `src/server/auth/*`, `src/services/*`):** Business logic, shirt-number conflict checks, team deletion guards, weighted OVR calculation, squad rating computation, ownership enforcement, RBAC permission assertions, and audit trail recording.
4. **Data Store Adapter (`src/server/database/devMemoryStore.js`, `src/server/database/databaseClient.js`):** Explicit `development-memory-fallback` repository hydrated with the RIVALRY 90 fictional universe (`32` athletes, `10` teams, `8` game modes, `6` events, `10` articles, `12` media frames) while Phases 18–20 PostgreSQL/Supabase schemas are staged next.
5. **Client Fetch Wrapper (`src/lib/api/apiClient.js`):** Shared browser wrapper with timeout handling (`AbortController`), JSON serialization, `same-origin` credentials for cookies, and structured `ApiClientError` normalization.

## Security Headers (`next.config.mjs`)
Configured globally without blocking Three.js / WebGL rendering:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

