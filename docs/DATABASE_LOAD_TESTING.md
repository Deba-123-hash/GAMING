# RIVALRY 90 — Database Load & Benchmark Plan

> **Honest Status:** Live remote PostgreSQL load benchmarks are **pending live Supabase provisioning** (not fabricated in local memory mode).

## Staging Benchmark Scenarios (To Run Once Supabase Connected)
1. **Athlete Catalog Search & Pagination:** `GET /api/players?position=FWD&sort=ovr-desc&page=1&pageSize=12` (tests `idx_players_position_group` and `idx_players_fts`).
2. **Team Roster Retrieval:** `GET /api/teams/apex-united/players` (tests `idx_players_team_id`).
3. **Squad Hydration & Save Concurrency:** Concurrent `POST /api/squads` & `PATCH /api/squads/[id]` verifying duplicate-player constraint handling (`23505` -> `409`).
4. **CMS Draft Isolation Under Load:** `GET /api/news` & `GET /api/events` confirming zero draft leaks and sub-50ms P95 response latency against Supabase staging.
5. **Audit Log Filtering:** `GET /api/admin/audit-logs?action=admin.` verifying `idx_audit_logs_action_role` & `idx_audit_logs_created_at`.

