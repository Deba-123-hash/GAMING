# RIVALRY 90 — Database Maintenance Guide

## Routine Maintenance Checklist (PostgreSQL / Supabase)
- **Weekly Integrity & Health Check:** Inspect `/admin/security` and run `npm.cmd run db:integrity` in CI.
- **Autovacuum & Statistics (`ANALYZE`):** Rely on PostgreSQL autovacuum for dead-tuple reclamation and planner statistics; avoid manual `VACUUM FULL` during active traffic because it takes an `ACCESS EXCLUSIVE` lock.
- **Index Review:** Check `pg_stat_user_indexes` after meaningful staging/production traffic before considering index pruning. Never drop an index on an idle/untested database.
- **Audit Log Retention:** `audit_logs` is append-only (`trg_audit_logs_immutable`); archive older historical slices (> 365 days) via scheduled read-only cold export before authorized compliance retention maintenance.

