# RIVALRY 90 — Project Documentation Index

Welcome to the engineering, architecture, 3D pipeline, and design documentation for **RIVALRY 90** — a next-generation, cinematic 3D football gaming website built with **Next.js App Router, React, JavaScript (ES6+), JSX, Tailwind CSS, Three.js, React Three Fiber, GSAP, and Motion for React**.

> **Scope Note:** RIVALRY 90 in this repository is the **official interactive 3D gaming website and showcase experience** (cinematic stadium reveal, fictional 3D player showcase, squad-builder preview, game modes, events, news, media, and 3D development hub). It is **not** a complete standalone playable football match simulation engine.

---

## Recommended Reading Order

| # | Document | Focus & Contents | Primary Audience |
|---|---|---|---|
| 01 | [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) | Vision, brand identity, scope, MVP boundaries, differentiation | All contributors |
| 02 | [PRODUCT_REQUIREMENTS_DOCUMENT.md](./PRODUCT_REQUIREMENTS_DOCUMENT.md) | Personas, MoSCoW features, functional & non-functional requirements | Product & Engineering |
| 03 | [TECH_STACK.md](./TECH_STACK.md) | Approved libraries, JS/JSX standards, 3D/animation/state choices | Engineering |
| 04 | [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) | Frontend, 3D, animation, state, and future Supabase integration | Architects & Leads |
| 05 | [WEBSITE_STRUCTURE_AND_SITEMAP.md](./WEBSITE_STRUCTURE_AND_SITEMAP.md) | App Router routes, navigation, page specifications, Mermaid sitemap | Frontend & UX |
| 06 | [UI_UX_DESIGN_SYSTEM.md](./UI_UX_DESIGN_SYSTEM.md) | Color palette, typography, CSS tokens, components, dark theme | UI/UX & Frontend |
| 07 | [THREE_JS_3D_ARCHITECTURE.md](./THREE_JS_3D_ARCHITECTURE.md) | Stadium, pitch, player rig, instanced crowd, lighting, camera rig | 3D Web Developers |
| 08 | [ANIMATION_AND_INTERACTION_GUIDE.md](./ANIMATION_AND_INTERACTION_GUIDE.md) | GSAP ScrollTrigger 8-scene storyboard, Motion, Lenis, AnimationMixer | Motion & 3D Engineers |
| 09 | [3D_ASSET_PIPELINE.md](./3D_ASSET_PIPELINE.md) | Blender, Mixamo, GLB export, Draco, Meshopt, KTX2 optimization | 3D Artists & Tech Art |
| 10 | [COMPONENT_ARCHITECTURE.md](./COMPONENT_ARCHITECTURE.md) | Server vs Client boundaries, component hierarchy, hooks, stores | React Architects |
| 11 | [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md) | Budgets, draw calls, LOD, WebGL fallbacks, Core Web Vitals | Performance & 3D |
| 12 | [RESPONSIVE_AND_ACCESSIBILITY_GUIDE.md](./RESPONSIVE_AND_ACCESSIBILITY_GUIDE.md) | Desktop/tablet/mobile adaptation, WCAG, reduced motion, audio | Frontend & QA |
| 13 | [TESTING_AND_QUALITY_ASSURANCE.md](./TESTING_AND_QUALITY_ASSURANCE.md) | Vitest, Playwright, ESLint, Prettier, Spector.js, Lighthouse | QA & Engineering |
| 14 | [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md) | Phased delivery roadmap from foundation to deployment | Project Management |
| 15 | [ANTIGRAVITY_AI_DEVELOPMENT_RULES.md](./ANTIGRAVITY_AI_DEVELOPMENT_RULES.md) | Mandatory rules for AI-assisted development and verification | AI Agents & Devs |

---

## Supporting & 3D Ecosystem Documentation

| Document | Focus & Contents |
|---|---|
| [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) | Phases 11–17 layered Next.js Route Handler & server service architecture |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | Complete REST API contract across `/api/*` (envelope, auth, profiles, squads, CMS, admin) |
| [ENVIRONMENT_CONFIGURATION.md](./ENVIRONMENT_CONFIGURATION.md) | Required & optional `.env.example` / `.env.local` server and public variables |
| [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md) | `scryptSync` password hashing, `r90_session` HMAC-SHA256 cookies, reset & verification flows |
| [ROLE_BASED_ACCESS_CONTROL.md](./ROLE_BASED_ACCESS_CONTROL.md) | 5-role hierarchy (`super_admin`..`user`) and server-side permission enforcement |
| [AUDIT_LOGGING_ARCHITECTURE.md](./AUDIT_LOGGING_ARCHITECTURE.md) | Append-only governance/security audit events with automated secret redaction |
| [SECURITY_TESTING_REPORT.md](./SECURITY_TESTING_REPORT.md) | Phases 11–17 security controls, threat mitigations, and development-mode limitations |
| [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md) | Phase 18 PostgreSQL & Supabase schema architecture and domain inventory |
| [DATABASE_ER_DIAGRAM.md](./DATABASE_ER_DIAGRAM.md) | Authoritative Mermaid ER diagram, primary/foreign keys, and cardinalities |
| [DATABASE_SCHEMA_REFERENCE.md](./DATABASE_SCHEMA_REFERENCE.md) | Complete table-by-table column, key, and purpose reference |
| [DATABASE_INDEXING_STRATEGY.md](./DATABASE_INDEXING_STRATEGY.md) | Targeted B-tree, partial unique, and GIN full-text search indexes |
| [DATABASE_MIGRATION_OPERATIONS.md](./DATABASE_MIGRATION_OPERATIONS.md) | Non-destructive migration checksums (`db:validate`) and promotion workflow |
| [DATABASE_SECURITY_HARDENING.md](./DATABASE_SECURITY_HARDENING.md) | RLS policies, SQLSTATE error sanitization, and credential isolation |
| [DATABASE_MONITORING_GUIDE.md](./DATABASE_MONITORING_GUIDE.md) | `GET /api/health/database` and `/admin/security` database operations view |
| [DATABASE_INTEGRITY_AUDIT.md](./DATABASE_INTEGRITY_AUDIT.md) | Non-destructive invariant verification (`db:integrity`) |
| [PRODUCTION_DATABASE_CHECKLIST.md](./PRODUCTION_DATABASE_CHECKLIST.md) | Pre-launch manual Supabase provisioning, backup & PITR verification |
| [INTERNAL_API_ARCHITECTURE.md](./INTERNAL_API_ARCHITECTURE.md) | Phase 21 layered Next.js internal API architecture & [openapi.yaml](./openapi.yaml) |
| [INTERNAL_API_REFERENCE.md](./INTERNAL_API_REFERENCE.md) | Full endpoint inventory across auth, profiles, catalogs, squads, CMS & admin |
| [API_FRONTEND_INTEGRATION.md](./API_FRONTEND_INTEGRATION.md) | Provider-safe TanStack React Query hooks (`src/lib/api/hooks.js`) & client wiring |
| [EXTERNAL_API_ARCHITECTURE.md](./EXTERNAL_API_ARCHITECTURE.md) | Phase 22 server-side external provider proxy, retry & rate-limit handling |
| [FOOTBALL_DATA_INTEGRATION.md](./FOOTBALL_DATA_INTEGRATION.md) | football-data.org v4 integration isolated from fictional game universe |
| [AI_INTEGRATION_GUIDE.md](./AI_INTEGRATION_GUIDE.md) | Google Gemini API assistant & advisory [AI_SQUAD_ANALYSIS.md](./AI_SQUAD_ANALYSIS.md) |
| [EXTERNAL_API_ENVIRONMENT_SETUP.md](./EXTERNAL_API_ENVIRONMENT_SETUP.md) | External integration `.env.example` variables & secret hygiene |
| [DATABASE_AND_BACKEND_PLAN.md](./DATABASE_AND_BACKEND_PLAN.md) | Future Phases 18–20 Supabase + PostgreSQL schema, RLS, and storage migration plan |
| [DEPLOYMENT_AND_DEVOPS.md](./DEPLOYMENT_AND_DEVOPS.md) | Git workflow, Vercel previews, Cloudflare caching, Sentry/rollback plan |
| [PROJECT_TASK_TRACKER.md](./PROJECT_TASK_TRACKER.md) | Live status tracker across the 25-phase roadmap & 3D hub |
| [BRAND_IDENTITY_GUIDE.md](./BRAND_IDENTITY_GUIDE.md) | RIVALRY 90 brand marks (`public/branding/`), voice, and originality policy |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Phase 06 token reference and `/design-system` UI component showcase |
| [CINEMATIC_EXPERIENCE_GUIDE.md](./CINEMATIC_EXPERIENCE_GUIDE.md) | Phase 10 Camera Director, 6 cinematic sequences, and fallback rules |
| [3D_SOFTWARE_INSTALLATION_GUIDE.md](./3D_SOFTWARE_INSTALLATION_GUIDE.md) | Step-by-step guide for Blender, Spline, Mixamo, Cascadeur, Substance 3D, GLB tools |
| [3D_TOOLS_AND_RESOURCE_DIRECTORY.md](./3D_TOOLS_AND_RESOURCE_DIRECTORY.md) | Categorized directory of 3D software, asset libraries, validators, and docs |
| [3D_ASSET_LICENSE_REGISTER.md](./3D_ASSET_LICENSE_REGISTER.md) | Mandatory license tracking ledger and IP compliance rules |

---

## Quick Development References

- **Root README:** [../README.md](../README.md)
- **3D Development Hub Route:** `/resources/3d` (`src/app/resources/3d/page.jsx`)
- **Central 3D Resource Registry:** `src/data/threeDResources.js`
- **Asset Manifest Registry:** `src/data/assetRegistry.js`
- **Language Standard:** JavaScript (ES6+) and JSX only — **no TypeScript**.

