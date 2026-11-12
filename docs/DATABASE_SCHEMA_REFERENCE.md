# RIVALRY 90 — Database Schema Reference

Canonical DDL resides in `database/migrations/0001_initial_schema.sql` and domain files in `database/schema/*.sql`.

| Table | PK | Key FKs & Unique Keys | Purpose |
|---|---|---|---|
| `users` | `id (UUID)` | `UNIQUE(email)`, `UNIQUE(username)`, `UNIQUE(auth_provider_id)` | Account identity & lifecycle status |
| `user_profiles` | `id (UUID)` | `UNIQUE FK(user_id -> users.id)` | Public/private football preferences & bio |
| `user_settings` | `user_id (UUID)` | `FK(user_id -> users.id)` | Theme & notification flags |
| `user_privacy_settings` | `user_id (UUID)` | `FK(user_id -> users.id)` | Profile visibility controls |
| `user_sessions` | `id (UUID)` | `FK(user_id)`, `UNIQUE(token_jti)` | Revocable session registry |
| `roles` / `permissions` | `id (VARCHAR)` | `UNIQUE(label)` | Canonical Phase 17 RBAC catalog |
| `role_permissions` / `user_roles` | Composite PK | FKs to `roles`, `permissions`, `users` | Many-to-many permission & user role mapping |
| `teams` | `id (UUID)` | `UNIQUE(slug)` | Fictional clubs & national teams |
| `players` | `id (UUID)` | `UNIQUE(slug)`, `FK(team_id)`, `UNIQUE(team_id, shirt_number)` | Canonical athlete identity & weighted OVR |
| `player_attributes` | `player_id (UUID)` | `FK(player_id -> players.id)` | Normalized 6-stat rating block (1–99) |
| `game_modes` | `id (UUID)` | `UNIQUE(slug)` | Website game mode catalogue (non-playable showcase) |
| `formations` / `formation_positions` | `code` / `id` | `UNIQUE(formation_code, slot_index)` | 10 tactical shapes & 110 normalized `(x, y)` coordinates |
| `squads` | `id (UUID)` | `FK(user_id)`, `FK(formation_code)`, `FK(preferred_team_id)` | User-owned tactical squads with optimistic `version` |
| `squad_players` | `id (UUID)` | `FK(squad_id)`, `FK(player_id)`, `UNIQUE(squad_id, player_id)` | Normalized 11 starters + 7 subs + partial unique captain |
| `events` / `event_registrations` | `id (UUID)` | `UNIQUE(slug)` / `UNIQUE(event_id, user_id)` | Tournaments & duplicate-protected registrations |
| `articles` / `tags` / `article_tag_relationships` | `id (UUID)` | `UNIQUE(slug)`, `FK(author_id)`, `FK(category_id)` | Editorial lifecycle (`draft`..`archived`) & SEO fields |
| `media_assets` / `media_attributions` / `media_collections` | `id (UUID)` | `FK(media_asset_id)`, `UNIQUE(slug)` | External object storage metadata & licensing ledger |
| `audit_logs` / `security_events` / `platform_settings` | `id` / `key` | `FK(actor_user_id -> users.id)` | Append-only governance & global settings |

