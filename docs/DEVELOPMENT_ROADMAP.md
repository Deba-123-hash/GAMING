# 14 — Development Roadmap (25-Phase Master Plan)

> **Roadmap Governance Rule:** The 25-phase order below is fixed across the entire lifecycle of RIVALRY 90. Never reorder, merge, or skip phases.

## Master 25-Phase Sequence

| Phase | Name | Scope Summary | Status |
|---|---|---|---|
| **01** | **Frontend Foundation** | Next.js App Router, JS/JSX only, Tailwind v4, CSS tokens, config, providers, R3F/GSAP/Motion/Zustand setup | Completed (Phase 01–10 Sprint) |
| **02** | **Website Layout** | Global `Header`, `MegaMenu`, `SearchDialog`, `MobileNavigation`, 4-column `Footer`, `PageHeader`, `Breadcrumbs` | Completed (Phase 01–10 Sprint) |
| **03** | **Homepage Development** | Complete 12-section football gaming homepage (`HeroSection` through `Footer`) | Completed (Phase 01–10 Sprint) |
| **04** | **Inner Pages Development** | `/game-modes`, `/players`, `/players/[playerId]`, `/teams`, `/teams/[teamId]`, `/stadium`, `/squad`, `/events`, `/news`, `/news/[slug]`, `/media`, `/community`, `/support`, `/privacy`, `/terms` | Completed (Phase 01–10 Sprint) |
| **05** | **Interactive Frontend** | Global local search, player/team/news/FAQ filters, sorting, interactive Squad Builder XI, Media Lightbox | Completed (Phase 01–10 Sprint) |
| **06** | **Brand Identity & Design System** | Original SVGs (`public/branding/`), `#080B09`/`#C6FF3D`/`#FF6B35` dark & light tokens, UI kit, `/design-system` | Completed (Phase 01–10 Sprint) |
| **07** | **Advanced UI/UX & Responsive Design** | Multi-viewport responsiveness (`320px`–`1920px`), touch targets, keyboard Escape/ARIA, WebGL fallback parity | Completed (Phase 01–10 Sprint) |
| **08** | **UI Animation System** | Central `src/animations/` presets, Motion variants, GSAP ScrollTrigger helpers, `AnimatedCounter`, reduced-motion support | Completed (Phase 01–10 Sprint) |
| **09** | **3D Animation System** | `AnimationStateMachine`, `threeDStore`, `modelLoader`, interactive `PlayerViewer` camera/clip controls, procedural stadium/crowd | Completed (Phase 01–10 Sprint) |
| **10** | **Cinematic Animation System** | `src/cinematic/` Camera Director, 6 selectable sequences (Intro, Stadium, Entrance, Matchday, Celebration, Trophy), Skip/Pause/Replay | Completed (Phase 01–10 Sprint) |
| **11** | **Backend Foundation** | Standardized Route Handlers (`/api/health`, `/api/version`), Zod validation, `src/server/*`, error envelope, rate limits, security headers | Completed (Phases 11–17 Sprint) |
| **12** | **Authentication System** | `scryptSync` password hashing, HMAC-SHA256 `HttpOnly` sessions, Auth UI (`/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`), `ProtectedRoute` | Completed (Phases 11–17 Sprint) |
| **13** | **User Profile System** | Private/public profiles (`/profile/*`, `/users/[username]`), privacy visibility controls, avatar validation (`<= 2 MB`), account deletion requests | Completed (Phases 11–17 Sprint) |
| **14** | **Player & Team Management** | 32 fictional athletes, 10 clubs/national teams, OVR calculator, paginated/filtered catalog, RBAC CRUD (`/api/players/*`, `/api/teams/*`) | Completed (Phases 11–17 Sprint) |
| **15** | **Game Modes & Squad Services** | 8 game modes, 10 formations (`FORMATIONS_CONFIG`), interactive tactical pitch, 7-sub bench, captain & ownership-enforced `/api/squads/*` | Completed (Phases 11–17 Sprint) |
| **16** | **Events, News & Media Management** | Event status computation, `/events/[slug]` registration, draft-isolated CMS APIs (`/api/events`, `/api/news`, `/api/media`) | Completed (Phases 11–17 Sprint) |
| **17** | **Admin & Security System** | 5-role RBAC matrix (`super_admin`..`user`), `/admin/*` console, immutable `auditLogs`, self-escalation & final super_admin protection | Completed (Phases 11–17 Sprint) |
| **18** | **Database Architecture & Schema** | PostgreSQL ERD (`database/diagrams/er-diagram.mmd`), 31-table modular SQL schemas, constraints, FKs, RLS & indexing architecture | Completed (Phases 18–20 Sprint) |
| **19** | **Database Implementation** | Sequential migrations (`0001`–`0003`), deterministic seed builders, cached Supabase client, SQLSTATE error mapper, CLI scripts | Completed (Phases 18–20 Sprint) |
| **20** | **Database Operations & Security** | Connection timeout/pooling, `GET /api/health/database`, `/admin/security` DB ops panel, non-destructive integrity auditor & ops guides | Completed (Phases 18–20 Sprint) |
| **21** | **Internal API Integration** | Standardized `/api/*` layer, pagination helper, TanStack React Query `useInternalQuery` hooks, squad slot CRUD, full frontend wiring & `openapi.yaml` | Completed (Phases 21–22 Sprint) |
| **22** | **External API Integration** | `football-data.org` v4, Google Gemini AI Squad/Player/Chat analyst, Resend, YouTube safe embeds, analytics sanitizer, `0004` migration & `/admin/integrations` | Completed (Phases 21–22 Sprint) |
| **23** | **Frontend & UI Testing** | Full Playwright E2E responsive & accessibility regression passes | Pending (Next Phase) |
| **24** | **Backend, Database & API Testing** | API contract, auth, and RLS security test suites | Pending |
| **25** | **Final Performance & Deployment Testing** | Production GLB/Draco/KTX2 asset audit, Lighthouse, Vercel + Cloudflare launch | Pending |

## Supporting Tooling Track
- **3D Development Hub (`/resources/3d`):** Active internal workspace (`src/data/threeDResources.js`, `src/data/assetRegistry.js`, `docs/3D_ASSET_LICENSE_REGISTER.md`).
