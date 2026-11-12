# 02 — Product Requirements Document (PRD)

## Table of Contents
1. [Product Vision & Objectives](#1-product-vision--objectives)
2. [Target Users & Personas](#2-target-users--personas)
3. [MoSCoW Feature Prioritization](#3-moscow-feature-prioritization)
4. [Main Website Sections & Functional Requirements](#4-main-website-sections--functional-requirements)
5. [Device & Viewport Requirements](#5-device--viewport-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [MVP Acceptance Criteria](#7-mvp-acceptance-criteria)

---

## 1. Product Vision & Objectives

RIVALRY 90 aims to set a benchmark for browser-based football gaming showcases by uniting WebGL immersion with crisp esports editorial clarity.

- **Objective 1:** Present the RIVALRY 90 universe (stadiums, fictional athletes, game modes, tournaments) with instant visual authority.
- **Objective 2:** Provide tactile 3D inspection of athletes and match environments without sacrificing page responsiveness.
- **Objective 3:** Support progressive enhancement so every route remains fast, accessible, and navigable even without high-end GPU hardware.

## 2. Target Users & Personas

| Persona | Profile | Primary Goal on RIVALRY 90 |
|---|---|---|
| **Alex (Competitive Player)** | 22, plays ranked football titles nightly | Inspect game modes, player ratings, formations, and upcoming seasonal cups |
| **Maya (Creator & Esports Fan)** | 26, streams & edits gaming highlights | Browse Media Gallery, player animations, cinematic trailers, and community hubs |
| **Liam (Mobile-First Visitor)** | 19, discovers trailer link on social media | Fast mobile load, readable key features, smooth touch navigation |
| **Studio Developer / 3D Artist** | Internal team contributor | Access `/resources/3d`, verify asset licenses, validate GLB optimization specs |

## 3. MoSCoW Feature Prioritization

### Must Have (MVP)
- Multi-page Next.js App Router architecture (`/`, `/overview`, `/game-modes`, `/players`, `/players/[playerId]`, `/teams`, `/teams/[teamId]`, `/stadium`, `/squad`, `/events`, `/news`, `/news/[slug]`, `/media`, `/community`, `/support`, `/resources/3d`).
- Responsive navigation bar, mobile drawer, and structured footer.
- Reusable React Three Fiber `CanvasWrapper` with lighting, camera rig, Suspense fallback, and WebGL error boundary.
- GSAP + ScrollTrigger integration with `prefers-reduced-motion` support.
- Motion-powered UI interactions (cards, menus, buttons).
- Fictional player, team, stadium, event, and news datasets in `src/data/`.
- Interactive Squad Builder preview (formation selection + player slot assignment via Zustand).
- User-opted audio controller via Howler.js (muted by default, never autoplaying).

### Should Have
- 8-scene scroll-choreographed stadium-to-pitch narrative on the home/overview flow.
- Instanced crowd system with configurable density tiers by device capability.
- Player animation clip switcher (`idle`, `walking`, `running`, `dribbling`, `shooting`, `celebration`).
- Interactive `/resources/3d` internal dashboard with search, filters, command copy, and checklist.

### Could Have
- Optional Lenis smooth scrolling synchronized with GSAP ScrollTrigger.
- Postprocessing bloom and subtle vignette on high-tier desktop GPUs.
- Leva developer-only 3D scene inspector toggled via environment flag.

### Future Roadmap (Post-MVP)
- Supabase Auth (accounts, saved squads, preferences).
- PostgreSQL-backed live tournament brackets and news CMS.
- Community clip uploads via Supabase Storage.

## 4. Main Website Sections & Functional Requirements

| ID | Feature Area | Functional Requirement |
|---|---|---|
| `FR-01` | **Hero & Stadium Reveal** | Render full-bleed hero with 3D stadium canvas (or fallback), RIVALRY 90 headline, primary CTAs, and scroll indicator. |
| `FR-02` | **3D Player Showcase** | Display fictional athlete card + 3D viewport supporting rotation, camera presets, and animation state selection. |
| `FR-03` | **Squad Builder** | Allow selecting formations (`4-3-3`, `4-2-3-1`, `3-5-2`), assigning players from roster, and computing team OVR summary. |
| `FR-04` | **Game Modes Explorer** | Filterable/selectable cards detailing Career Dynasty, Rivals Ranked, Street 5v5, and Global Cup. |
| `FR-05` | **Teams & Stadiums** | Dedicated profiles showing club crest colors, tactical identity, home arena specs, and capacity. |
| `FR-06` | **Events, News & Media** | Filterable tournament calendar, slug-routed news articles, and media gallery with category tabs. |
| `FR-07` | **Support & Forms** | React Hook Form + Zod validated contact/bug-report form with clear client-side feedback. |
| `FR-08` | **Audio Toggle** | Persistent mute/unmute toggle in navbar/UI; zero audio playback prior to explicit user gesture. |

## 5. Device & Viewport Requirements

- **Desktop (`>= 1280px`):** Full multi-column bento grids, persistent top navigation, high-tier 3D DPR (`1`–`2`), optional postprocessing.
- **Tablet (`768px`–`1279px`):** 2-column responsive layouts, adaptive 3D DPR (`1`–`1.5`), touch-enabled orbit controls.
- **Mobile (`< 768px`):** Single-column stacked sections, slide-over `MobileNavigation`, medium/low 3D preset or static fallback poster to preserve battery and frame rate.

## 6. Non-Functional Requirements

- **Performance:** Target LCP `< 2.5s` on broadband desktop, CLS `< 0.1`, lazy-loaded non-hero 3D scenes.
- **Accessibility:** WCAG 2.1 AA contrast (`>= 4.5:1` body text), full keyboard navigation, visible focus rings, `prefers-reduced-motion` parity.
- **Security:** Zero secrets in client bundles; Zod validation on all form inputs; safe `rel="noopener noreferrer"` on external links.
- **Code Standards:** JavaScript ES6+ and JSX only; zero `.ts`/`.tsx` files; clean ESLint + Prettier passes.

## 7. MVP Acceptance Criteria

1. All planned App Router routes render without runtime or hydration errors.
2. `npm run lint`, `npm run test`, and `npm run build` succeed cleanly.
3. 3D Canvas mounts safely with visible fallback if WebGL is disabled.
4. No broken links, no console errors, and verified responsive behavior across desktop, tablet, and mobile.

---

**Related Documents:** [01 — Project Overview](./PROJECT_OVERVIEW.md) · [05 — Sitemap](./WEBSITE_STRUCTURE_AND_SITEMAP.md) · [13 — QA & Testing](./TESTING_AND_QUALITY_ASSURANCE.md)

