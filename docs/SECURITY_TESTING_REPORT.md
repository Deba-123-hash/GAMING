# Security Testing Report (Phases 11–17)

## Verified Controls (Automated Vitest Suite + Code Audit)
| Control | Verification Result | Reference |
|---|---|---|
| Scrypt password hashing & unique per-user salts | Verified via unit tests | `tests/unit/authProfileAdmin.test.js` |
| `HttpOnly`, `SameSite=Lax` signed session cookies (`r90_session`) | Verified across auth & API routes | `src/server/auth/sessionService.js` |
| Account enumeration resistance (`forgot-password`) | Verified (`200` uniform response) | `tests/unit/authProfileAdmin.test.js` |
| Single-use password reset token & all-session revocation | Verified (replay returns `400`, old cookie invalid) | `tests/unit/authProfileAdmin.test.js` |
| Public profile privacy filtering & zero email leakage | Verified (`private` hides bio/preferences, email omitted) | `tests/unit/authProfileAdmin.test.js` |
| Master catalog & CMS RBAC gating (`401`/`403`) | Verified (`user` blocked from `POST /api/players`, `moderator` blocked from `GET /api/admin/audit-logs`) | `tests/unit/authProfileAdmin.test.js` |
| Squad ownership isolation (`403` cross-user access) | Verified | `tests/unit/authProfileAdmin.test.js` |
| Draft CMS isolation from public routes | Verified (`GET /api/news` & `GET /api/news/[slug]` hide drafts) | `tests/unit/authProfileAdmin.test.js` |
| Admin self-role-change & self-suspension blocking (`403`) | Verified | `tests/unit/authProfileAdmin.test.js` |
| Open-redirect mitigation on `/api/auth/callback` & `/login` | Sanitized to same-origin leading `/` paths | `src/server/auth/authValidation.js` |
| Secret-free client bundle (`src/lib/env.js`) | Public getter only reads `NEXT_PUBLIC_*` | `src/lib/env.js` |

## Explicit Current Environment Limitations
- **Development Memory Mode:** Because live Supabase credentials (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) and database migrations (Phases 18–20) are not yet applied in `.env.local`, users, sessions, squads, and audit logs live in `devMemoryStore.js` in memory and reset on server restart.
- **Email Delivery:** No `RESEND_API_KEY` is configured; password reset and email verification APIs honestly return `emailDelivered: false`.
- **Rate Limiter Scope:** `src/server/security/rateLimit.js` uses per-instance in-memory sliding windows (documented adapter for Phase 20/25 Redis/Upstash swap).

