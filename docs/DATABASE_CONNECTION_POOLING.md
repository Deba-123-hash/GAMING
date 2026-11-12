# RIVALRY 90 — Database Connection Pooling Guide (Phase 20)

- **Selected Pooling Architecture:** Supabase managed **PgBouncer / PostgREST HTTP pooling** via cached singleton `@supabase/supabase-js` client (`src/lib/supabase/server.js`).
- **Why No Second Pool:** Introducing a local `pg.Pool` alongside `@supabase/supabase-js` or in serverless Next.js edge/lambda workers risks exhausting Supabase connection limits. Reusing the stateless PostgREST client (`persistSession: false`, `autoRefreshToken: false`) eliminates per-request connection leaks cleanly.
- **Direct Connection Rule:** Direct PostgreSQL (`db.*.supabase.co:5432`) is reserved strictly for CLI migrations; application runtime queries use HTTPS REST/Supavisor transaction pooling (`6543`) if direct drivers are later added.
- **Failure Handling:** Tested via `runWithDatabaseTimeout()` timeout tests in `tests/unit/databaseArchitectureAndOps.test.js` (`504` on exceeded timeout, `503` on network refusal).

