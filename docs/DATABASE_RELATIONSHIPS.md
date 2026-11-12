# RIVALRY 90 — Entity Relationships & Cascading Rules

## Cardinality Summary
- **One-to-One:** `users` <-> `user_profiles`, `users` <-> `user_settings`, `users` <-> `user_privacy_settings`, `players` <-> `player_attributes`, `media_assets` <-> `media_attributions`.
- **One-to-Many:** `users` -> `squads` (`ON DELETE CASCADE`), `teams` -> `players` (`ON DELETE RESTRICT` preventing orphaned athletes or accidental team deletion with active rosters), `formations` -> `formation_positions` (`ON DELETE CASCADE`), `squads` -> `squad_players` (`ON DELETE CASCADE`), `events` -> `event_registrations` (`ON DELETE CASCADE`).
- **Many-to-Many Junctions:** `roles` <-> `permissions` (`role_permissions`), `users` <-> `roles` (`user_roles`), `articles` <-> `tags` (`article_tag_relationships`), `media_collections` <-> `media_assets` (`collection_media`).

## Player-Team Single Source of Truth
Current club/national team affiliation is stored once on `players.team_id` (`FK -> teams.id ON DELETE RESTRICT`), matching `src/services/playerService.js` and `src/services/teamService.js`. Historical transfers are intentionally deferred to future expansion to prevent conflicting roster sources of truth.

## Referential Protection Highlights
- Deleting a team with assigned players is blocked by both `teamService.deleteMasterTeam()` and `fk_players_team ON DELETE RESTRICT`.
- Deleting an article or user sets `author_id` / `actor_user_id` to `NULL` (`ON DELETE SET NULL`) so historical `audit_logs` and published dispatches are preserved.

