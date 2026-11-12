# RIVALRY 90 — Database Architecture (`database/`)

PostgreSQL / Supabase relational database definitions, versioned non-destructive migrations, deterministic seed scripts, and Mermaid ER diagram source.

## Directory Layout
- `diagrams/er-diagram.mmd` — Authoritative Mermaid entity-relationship source aligned with all SQL schemas.
- `schema/` — Domain-grouped reference DDL files (`00`–`06`) documenting canonical tables, constraints, RLS policies, and indexes.
- `migrations/` — Sequential, idempotent forward migrations (`0001`, `0002`, `0003`) for Phase 19 execution plus rollback notes.
- `seeds/` — Deterministic seed generators and SQL upserts (`32` athletes, `10` teams, `10` formations, `8` game modes, `6` events, `10` articles, `12` media items, `5` roles, `19` permissions).

## Rules
- **No destructive operations** in migrations (`DROP TABLE`, `TRUNCATE`, blind resets are forbidden).
- **Least privilege & RLS:** Client browser code (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) never accesses tokens, password hashes, private profiles, or `audit_logs`.
- **Naming Convention:** `snake_case` tables & columns, `uuid` PK `id`, `created_at` & `updated_at` `TIMESTAMPTZ`, explicit `fk_*`, `chk_*`, `uq_*`, and `idx_*` names.

