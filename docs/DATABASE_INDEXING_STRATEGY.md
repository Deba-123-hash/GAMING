# RIVALRY 90 — Database Indexing Strategy

Defined in `database/migrations/0002_indexes_and_fts.sql` to accelerate observed application queries while avoiding redundant write overhead:

| Index | Columns / Type | Query Pattern Served |
|---|---|---|
| `idx_users_role_status` | `(primary_role, status)` | Admin user filtering in `/api/admin/users` |
| `idx_user_sessions_user_active` | Partial `(user_id) WHERE revoked = FALSE` | Fast revocation & active session counting |
| `idx_players_pub_ovr` | `(publication_status, overall_rating DESC)` | Paginated `/api/players` default catalog sort |
| `idx_players_team_id` | `(team_id)` | `/api/teams/[teamId]/players` roster lookup |
| `idx_players_position_group` | `(position_group, overall_rating DESC)` | Position tab filter (`GK`, `DEF`, `MID`, `FWD`) |
| `idx_players_fts` | GIN `to_tsvector('english', ...)` | Full-text search without external search infrastructure |
| `idx_teams_pub_type_rating` | `(publication_status, team_type, rating DESC)` | `/api/teams` Club vs National Team filtering |
| `idx_squads_user_updated` | `(user_id, updated_at DESC)` | `/api/squads` user dashboard lookup |
| `uq_squad_single_captain` | Partial Unique `(squad_id) WHERE is_captain = TRUE` | Enforces max 1 captain per squad at DB level |
| `idx_events_pub_start` | `(publication_status, start_at ASC)` | `/api/events` schedule sorting |
| `idx_articles_pub_published_at` & `idx_articles_fts` | Composite + GIN | `/api/news` sorting, draft isolation & text search |
| `idx_media_pub_type_cat` & `idx_media_featured` | Composite + Partial | `/api/media` gallery filtering |
| `idx_audit_logs_created_at` & `idx_audit_logs_action_role` | B-tree | `/api/admin/audit-logs` governance inspection |

