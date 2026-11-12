# Migration Rollback & Safety Notes

1. **Forward-Only Production Rule:** Never run blind `DROP TABLE` scripts against staging or production. Take a verified database snapshot / PITR restore point before applying any schema migration.
2. **Rollback 0003 (RLS/Triggers):** Disable specific newly added policies (`DROP POLICY IF EXISTS ...`) or drop `trg_audit_logs_immutable` only within an approved maintenance window.
3. **Rollback 0002 (Indexes):** Drop individual newly created indexes with `DROP INDEX CONCURRENTLY IF EXISTS <index_name>;` to avoid blocking reads/writes.
4. **Rollback 0001 (Schema):** Only rollback an initial greenfield deployment in a non-production sandbox after exporting any test fixtures.

