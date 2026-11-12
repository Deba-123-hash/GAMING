# RIVALRY 90 — Database Constraints Specification

Database-level constraints mirror and reinforce Zod schemas (`src/server/validation/domainSchemas.js`):

- **Identity Uniqueness & Format:** `UNIQUE(email)`, `UNIQUE(username)`, `chk_users_username_format` (`^[a-zA-Z0-9_-]{3,24}$`), valid roles (`super_admin`, `admin`, `content_manager`, `moderator`, `user`), valid statuses (`active`, `suspended`, `banned`).
- **Ratings Bounds (1–99):** Enforced across `players.overall_rating` and all 6 columns in `player_attributes` (`pace`, `shooting`, `passing`, `dribbling`, `defending`, `physical`). Teams enforce `rating BETWEEN 40 AND 99`.
- **Team Roster Safety:** `uq_players_team_number UNIQUE (team_id, shirt_number)` and `chk_players_number` (`1..99`).
- **Squad & Lineup Invariants:**
  - `uq_squad_unique_player UNIQUE (squad_id, player_id)` prevents assigning the same athlete twice.
  - `chk_sp_slot_bounds` enforces max 11 starters (`0..10`) and max 7 substitutes (`0..6`).
  - `uq_squad_single_captain` partial unique index `(squad_id) WHERE is_captain = TRUE` limits each squad to at most 1 captain.
- **Event & Registration Integrity:** `chk_events_date_range` (`end_at >= start_at`) and `uq_event_user_reg UNIQUE (event_id, user_id)` prevents duplicate user registrations.
- **Publication Lifecycles:** `chk_*_pub_status` restricts `events`, `articles`, and `media_assets` to `('draft', 'review', 'scheduled', 'published', 'archived')`.

