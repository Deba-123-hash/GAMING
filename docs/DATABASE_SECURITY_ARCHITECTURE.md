# RIVALRY 90 — Database Security Architecture

- **Credential Isolation:** `SUPABASE_SERVICE_ROLE_KEY` and `AUTH_SESSION_SECRET` are strictly server-only (`src/lib/env.js` keeps `getPublicEnv()` isolated to `NEXT_PUBLIC_*`).
- **Supabase RLS (`database/migrations/0003_rls_and_security.sql`):** All 31 public tables enable Row-Level Security. Anonymous/public keys can only read explicitly `published` catalog content and own profile/squad rows bound to `auth.uid()`. `users`, `user_sessions`, `roles`, `permissions`, `audit_logs`, and `security_events` expose zero public client policies.
- **Immutable Audit History:** Trigger `trg_audit_logs_immutable` rejects `UPDATE` and `DELETE` on `public.audit_logs`.
- **Parameterized Access & Safe Errors:** `normalizeDatabaseError()` in `src/server/database/databaseErrors.js` maps PostgreSQL SQLSTATE errors cleanly without revealing SQL text, constraint internals, or secrets.

