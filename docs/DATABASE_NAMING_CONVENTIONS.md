# RIVALRY 90 — PostgreSQL Naming Conventions

1. **Case Style:** Strict lowercase `snake_case` for every schema object, table, column, constraint, trigger, and index.
2. **Primary Keys:** `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` for transactional entities; semantic `VARCHAR` primary keys (`id` / `code` / `key`) for static reference tables (`roles.id`, `permissions.id`, `formations.code`, `platform_settings.key`).
3. **Foreign Keys:** Explicit constraint names prefixed by `fk_<table_abbrev>_<target>` referencing `<target_singular>_id`.
4. **Unique Constraints:** Prefixed by `uq_<scope>`.
5. **Check Constraints:** Prefixed by `chk_<table_abbrev>_<rule>`.
6. **Indexes:** Standard B-tree / GIN indexes prefixed by `idx_<table>_<columns>`.
7. **Timestamps:** Always `TIMESTAMPTZ` named `created_at`, `updated_at`, `published_at`, `start_at`, `end_at`.
8. **Booleans & Statuses:** Descriptive flags (`email_verified`, `is_featured`, `is_captain`) and check-constrained status strings matching application Zod enums verbatim.

