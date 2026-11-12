# RIVALRY 90 — Database Backup & Recovery Guide

> **Verification Notice:** No live Supabase PostgreSQL instance is connected in `.env.local` yet. Live automated backup schedules and Point-in-Time Recovery (PITR) remain **awaiting provider configuration** until the Supabase project is provisioned.

## Provider Backup Capabilities (Supabase PostgreSQL)
- **Daily Automated Backups:** Managed daily snapshots (Pro+ plans support 7–30 day retention and optional PITR).
- **Pre-Migration Exports:** Always run `pg_dump --schema-only` and `pg_dump --format=custom` (stored securely outside Git, never with credentials committed) prior to applying schema migrations.

## Safe Recovery Procedure (Staging-First)
1. **Create Restore Target:** Provision a separate staging/recovery database or Supabase branch — never overwrite live production in-place during validation.
2. **Execute Restore:** Use Supabase Dashboard Backups -> Restore to new project/branch, or `pg_restore --clean --if-exists --no-owner` against staging.
3. **Verify Integrity:** Run integrity queries & `npm.cmd run db:integrity` checking `users`, `squads`, `players`, `teams`, and `audit_logs` counts + zero orphan FKs.
4. **Cutover & Rotate Keys:** Update server environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`), verify `/api/health/database`, and audit recent sessions.

