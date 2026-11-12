# RIVALRY 90 — Deterministic Seed Data Plan

Seed modules live in `database/seeds/buildSeedPayload.js`, `database/seeds/001_seed_rbac_and_catalog.sql`, and `scripts/seed-database.mjs` (`npm.cmd run db:seed:dry`).

## Verified Counts (100% Original Fictional Universe)
- **32 Fictional Players** (`src/data/players.js`) + 6-stat `player_attributes`
- **10 Fictional Teams** (`src/data/teams.js`: **6** Fictional Clubs + **4** Fictional National Teams)
- **10 Tactical Formations** & **110 normalized pitch slot coordinates** (`src/lib/formations.js`)
- **8 Showcase Game Modes** (`src/data/gameModes.js`)
- **6 Fictional Events** (`src/data/events.js`)
- **10 Fictional News Articles** (`src/data/news.js`)
- **12 Media Metadata Records** (`src/data/mediaData.js`) & **10 Content Categories** (`src/data/categories.js`)
- **5 RBAC Roles & 19 Permissions** (`src/server/auth/rbac.js`)

## Safety Guarantees
- Zero real-world player likenesses or copyrighted club crests.
- Zero hardcoded demo user passwords or demo admin accounts seeded into production.
- `scripts/seed-database.mjs` explicitly aborts if `NODE_ENV=production` unless `--allow-catalog-sync` is intentionally provided.

