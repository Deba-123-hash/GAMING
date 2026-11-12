# 16 — Database & Backend Integration Plan (Future Scope)

> **Status:** PHASE 11 BACKEND FOUNDATION ACTIVE (Route Handlers + Service Layer + Zod Validation). Database migrations & Auth arrive in Phases 12 & 18–20. When Supabase credentials are absent in `.env.local`, read endpoints serve structured `src/data/*.js` fallbacks and write endpoints return `202` (`persisted: false`, `mode: 'validation-only-no-db'`).

## Table of Contents
1. [Backend Stack](#1-backend-stack)
2. [Planned PostgreSQL Schema](#2-planned-postgresql-schema)
3. [Authentication & Row-Level Security](#3-authentication--row-level-security)
4. [Storage Buckets & Media](#4-storage-buckets--media)
5. [Next.js Route Handlers & Validation](#5-nextjs-route-handlers--validation)

---

## 1. Backend Stack

- **Supabase:** Managed PostgreSQL database, GoTrue Authentication, and S3-backed Object Storage.
- **Next.js Route Handlers (`src/app/api/*`):** Server-side endpoints validating payloads with **Zod** before querying Supabase.
- **TanStack React Query:** Client cache invalidation and optimistic UI updates.

## 2. Planned PostgreSQL Schema

| Table | Purpose | Key Columns |
|---|---|---|
| `profiles` | User profile & preferences | `id (uuid, FK auth.users)`, `username`, `favorite_club_id`, `audio_enabled`, `updated_at` |
| `players` | Fictional athlete catalog | `id`, `slug`, `name`, `position`, `ovr`, `stats (jsonb)`, `model_url`, `team_id` |
| `teams` | Fictional clubs & kits | `id`, `name`, `short_code`, `primary_color`, `secondary_color`, `stadium_id` |
| `saved_squads` | User-built formations | `id`, `user_id`, `name`, `formation`, `slots (jsonb)`, `created_at` |
| `events` | Tournaments & qualifiers | `id`, `title`, `status`, `start_date`, `prize_pool`, `mode` |
| `news_articles` | Studio dispatches & patch notes | `id`, `slug`, `title`, `category`, `body_md`, `published_at` |

## 3. Authentication & Row-Level Security

- Enable Supabase **Row-Level Security (RLS)** on every table.
- Public read-only access for `players`, `teams`, `events`, and published `news_articles`.
- Authenticated user read/write scoped strictly to `auth.uid() = user_id` on `profiles` and `saved_squads`.

## 4. Storage Buckets & Media

- `rivalry90-public-assets`: Optimized WebP/AVIF portraits and stadium wallpapers.
- `rivalry90-3d-models`: Versioned `.glb` files served via CDN with immutable cache headers.

## 5. Next.js Route Handlers & Validation

- Every `POST`/`PATCH` route handler will parse JSON with `zod` schemas shared from `src/utils/validators.js`.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client components or `NEXT_PUBLIC_*` variables.

---

**Related Documents:** [04 — System Architecture](./SYSTEM_ARCHITECTURE.md) · [17 — Deployment & DevOps](./DEPLOYMENT_AND_DEVOPS.md)

