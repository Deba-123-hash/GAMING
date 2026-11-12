# RIVALRY 90 — Production Database Readiness Checklist

## Completed in Codebase (Phases 18–20)
- [x] Normalized PostgreSQL schema, PKs, FKs, CHECK/UNIQUE constraints (`database/schema/*.sql`, `0001_initial_schema.sql`)
- [x] Authoritative Mermaid ER diagram (`docs/DATABASE_ER_DIAGRAM.md`, `database/diagrams/er-diagram.mmd`)
- [x] Targeted B-tree, partial unique, and GIN FTS indexes (`0002_indexes_and_fts.sql`)
- [x] Row-Level Security policies & immutable `audit_logs` trigger (`0003_rls_and_security.sql`)
- [x] Singleton client reuse & PostgreSQL error normalization (`src/lib/supabase/server.js`, `src/server/database/databaseErrors.js`)
- [x] Health & Admin DB Operations UI (`GET /api/health/database`, `/admin/security`)
- [x] Non-destructive migration verifier & fixture integrity audit (`npm.cmd run db:validate`)

## Manual Provider Configuration Required Before Production Cutover
- [ ] Provision production & staging Supabase projects (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, server-only `SUPABASE_SERVICE_ROLE_KEY`, strong `AUTH_SESSION_SECRET`).
- [ ] Apply `0001`–`0003` migrations and run idempotent catalog seed against staging first, then production.
- [ ] Verify Supabase automated daily backups, PITR retention, and execute a test restore onto staging.
- [ ] Run staging RLS & `EXPLAIN (ANALYZE, BUFFERS)` verification against live PostgreSQL.

