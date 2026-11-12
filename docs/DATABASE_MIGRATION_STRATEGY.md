# RIVALRY 90 — Database Migration Strategy

## Ordering & Idempotency
Migrations under `database/migrations/` execute strictly in lexical numeric order and record checksums in `public.schema_migrations`:
1. `0001_initial_schema.sql` — Extensions, `set_updated_at()` trigger function, domain tables, foreign keys, `UNIQUE`/`CHECK` constraints, triggers.
2. `0002_indexes_and_fts.sql` — Targeted B-tree, partial unique, and GIN full-text search indexes.
3. `0003_rls_and_security.sql` — Enable RLS across all tables, apply policies, attach immutable `audit_logs` trigger.

## Environment Promotion Workflow
- **Local / Development:** Run `npm.cmd run db:validate` to verify SQL checksums and zero destructive `DROP TABLE` / `TRUNCATE TABLE` statements before pushing to staging Supabase SQL Editor / CLI (`supabase db push`).
- **Staging:** Apply pending migrations against staging, verify row counts & run integrity suite.
- **Production:** Take manual snapshot / verify automated PITR window first; apply forward-only migrations during low-traffic windows. Never reset production.

