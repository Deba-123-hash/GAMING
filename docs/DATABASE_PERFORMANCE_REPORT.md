# RIVALRY 90 — Database Performance Report (Phase 20)

## Implemented Optimizations
- **Timeout Guarding:** `runWithDatabaseTimeout()` in `src/server/database/databaseClient.js` enforces bounded latency (`5000ms` default, `4000ms` health probe) preventing hung serverless workers.
- **Singleton Client Reuse:** `getServerSupabaseClient()` caches a single initialized Supabase instance per credential signature instead of creating fresh HTTP/auth clients on every Route Handler call.
- **Targeted Composite & GIN Indexes (`0002_indexes_and_fts.sql`):** Indexed `players (publication_status, overall_rating DESC)`, `players (position_group, overall_rating DESC)`, `squads (user_id, updated_at DESC)`, `events (publication_status, start_at ASC)`, `articles (publication_status, published_at DESC)`, and GIN FTS indexes for player/news text search.

## Measurement Scope
Live `EXPLAIN (ANALYZE, BUFFERS)` query plans against PostgreSQL have **not** been measured yet because no remote Supabase PostgreSQL database is connected in `.env.local`. Re-run `EXPLAIN (ANALYZE, BUFFERS)` in staging immediately after applying `0001`–`0003` and seeding staging data.

