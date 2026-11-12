# RIVALRY 90 — Internal API Architecture (Phase 21)

## Layered Structure
- **Route Handlers (`src/app/api/**`):** Handle HTTP parsing, rate limits, cookie/session lookup (`getServerSession`), and delegate exceptions to `handleApiError()`.
- **Domain Services (`src/services/*.js`, `src/server/services/*.js`, `src/server/auth/*.js`):** Enforce business logic (shirt number uniqueness, weighted OVR computation, squad duplicate-player & ownership checks, draft CMS isolation).
- **Database Adapters (`src/server/database/*.js`, `src/lib/supabase/server.js`):** Provide `development-memory-fallback` + Supabase PostgreSQL readiness & SQLSTATE error mapping.
- **Validation & Pagination (`src/server/utils/validation.js`, `src/server/validation/domainSchemas.js`, `src/lib/api/pagination.js`):** Shared Zod validation and bounded page/limit metadata.
- **Response Builders (`src/server/utils/apiResponse.js`, `src/lib/api/response.js`):** Unified JSON envelope `{ success, ok, message, data, meta }`.

