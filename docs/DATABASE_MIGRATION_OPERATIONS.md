# RIVALRY 90 — Database Migration Operations

## Safety Verification (`npm.cmd run db:validate`)
- `scripts/migrate-database.mjs` & `src/server/database/migrationRegistry.js` inspect every `.sql` file in `database/migrations/`, verify lexical ordering (`0001`..`0003`), compute SHA-256 checksums, and **reject any `DROP TABLE` or `TRUNCATE TABLE` statement**.
- `database/migrations/rollback_notes.md` documents non-destructive rollback steps.

## Environment Promotion Steps
1. Verify local migrations & tests pass: `npm.cmd run db:validate && npm.cmd run test`.
2. Backup target staging/production database before schema changes.
3. Apply `0001_initial_schema.sql`, `0002_indexes_and_fts.sql`, and `0003_rls_and_security.sql` sequentially to Supabase staging, then verify `GET /api/health/database`.
4. Only promote to production after staging verification passes with zero anomalies.

