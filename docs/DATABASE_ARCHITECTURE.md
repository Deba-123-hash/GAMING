# RIVALRY 90 — Database Architecture (Phase 18)

## Provider & Inspection Findings
- **Configured Provider Target:** Supabase PostgreSQL (`@supabase/supabase-js` `^2.119.0`, `src/lib/supabase/server.js`, `src/server/database/databaseClient.js`).
- **Live Runtime State at Inspection:** `.env.local` is absent; `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are unset. Runtime operates explicitly in `development-memory-fallback` (`src/server/database/devMemoryStore.js`).
- **No Duplicate Providers/ORMs:** Uses `@supabase/supabase-js` PostgREST/PgBouncer directly alongside modular SQL definitions in `database/schema/` and forward migrations in `database/migrations/`.

## Domain Organization
1. **Identity, Profile & RBAC (`01_identity_and_rbac.sql`):** `users`, `user_profiles`, `user_settings`, `user_privacy_settings`, `user_sessions`, `roles`, `permissions`, `role_permissions`, `user_roles`. Compatible with external Supabase `auth.users(id)` via nullable `auth_provider_id`.
2. **Football Universe & Squads (`02_football_universe.sql`):** `teams`, `players`, `player_attributes`, `game_modes`, `formations`, `formation_positions`, `squads`, `squad_players`.
3. **Content, Events & Media (`03_content_and_media.sql`):** `content_categories`, `tags`, `events`, `event_registrations`, `articles`, `article_tag_relationships`, `media_assets`, `media_attributions`, `media_collections`, `collection_media`, `support_tickets`.
4. **Admin, Audit & Operations (`04_admin_audit_and_security.sql`):** `audit_logs`, `security_events`, `platform_settings`, `schema_migrations`.

