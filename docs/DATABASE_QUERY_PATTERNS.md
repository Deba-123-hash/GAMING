# RIVALRY 90 — Database Query Patterns

- **Paginated Athlete Catalog (`/api/players`):** Filters `publication_status = 'published'`, optional `team_id`, `position_group`, and OVR range, ordered by `overall_rating DESC` (`idx_players_pub_ovr`, `idx_players_position_group`) with `LIMIT` + `OFFSET`.
- **Team Roster (`/api/teams/[teamId]/players`):** Single indexed lookup on `players.team_id` (`idx_players_team_id`) avoiding N+1 player stats queries by joining/selecting `player_attributes`.
- **Squad Hydration (`/api/squads`):** Fetches `squads` for `user_id` (`idx_squads_user_updated`), loads normalized `squad_players`, prevents duplicates via `uq_squad_unique_player`, and computes OVR/line ratings server-side via `calculateSquadRatings()`.
- **CMS Public vs Draft Isolation (`/api/news`, `/api/events`, `/api/media`):** Default queries enforce `publication_status = 'published'`. Draft rows are queried ONLY after server-side `hasPermission(session.user, '<domain>.manage')`.
- **Admin Governance & Audit Logs (`/api/admin/audit-logs`):** Cursor/page slice ordered by `created_at DESC` (`idx_audit_logs_created_at`) filtering optional `action` and `actor_role`.

