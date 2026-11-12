# 03 — Technology Stack Specification

## Table of Contents
1. [Language & Runtime Standards](#1-language--runtime-standards)
2. [Core Frontend Stack](#2-core-frontend-stack)
3. [3D Web & Asset Tooling Stack](#3-3d-web--asset-tooling-stack)
4. [Animation & Smooth Scroll Stack](#4-animation--smooth-scroll-stack)
5. [State, Forms & Data Fetching](#5-state-forms--data-fetching)
6. [Audio & Backend Readiness](#6-audio--backend-readiness)
7. [Quality, Testing & DevOps Tools](#7-quality-testing--devops-tools)
8. [Deferred or Excluded Packages](#8-deferred-or-excluded-packages)

---

## 1. Language & Runtime Standards

- **JavaScript (ES6+)** and **JSX** exclusively across application source, tests, and tooling configs.
- **TypeScript is strictly excluded**: no `.ts`, `.tsx`, or `tsconfig.json` files. Path aliases (`@/* -> ./src/*`) are configured via `jsconfig.json`.
- **Package Manager:** `npm` (`package-lock.json` preserved).

## 2. Core Frontend Stack

| Technology | Role | Where Used | MVP Status |
|---|---|---|---|
| **Next.js (App Router)** | SSR/SSG framework, routing, metadata, image optimization | `src/app/**`, `next.config.mjs` | Required |
| **React 19 + React DOM** | Component UI library | All `.jsx` components | Required |
| **Tailwind CSS v4** | Utility-first styling + CSS theme tokens | `src/app/globals.css`, `src/styles/` | Required |
| **Radix UI + shadcn/ui patterns** | Accessible headless primitives (Dialog, Tabs, Select, Tooltip, Slot) | `src/components/ui/` | Required |
| **clsx + tailwind-merge + CVA** | Deterministic class merging and component variants | `src/lib/utils.js`, UI primitives | Required |
| **Lucide React** | Consistent vector icon system | Navigation, cards, `/resources/3d` | Required |

## 3. 3D Web & Asset Tooling Stack

| Technology | Role | Where Used | MVP Status |
|---|---|---|---|
| **Three.js** | Core WebGL rendering engine, `AnimationMixer`, `InstancedMesh`, loaders | `src/lib/three.js`, `src/components/3d/` | Required |
| **@react-three/fiber (v9)** | Declarative React renderer for Three.js compatible with React 19 | `CanvasWrapper.jsx`, 3D scene tree | Required |
| **@react-three/drei (v10)** | Camera helpers, `useGLTF`, `Environment`, `Html`, `Sparkles`, loaders | `src/components/3d/` | Required |
| **@react-three/postprocessing** | Bloom, vignette, tone-mapping effects for high-tier scenes | `StadiumScene.jsx` (optional tier) | Optional/Tiered |
| **@react-three/rapier** | Physics wrapper for future interactive ball/prop experiments | `src/components/3d/` (future) | Installed/Deferred Use |
| **leva** | Developer-only 3D lighting & camera tweak panel | Dev mode only | Dev Optional |
| **gltfjsx / @gltf-transform/cli / gltf-validator** | CLI asset conversion, Draco/Meshopt/KTX2 optimization, GLB validation | `scripts/`, offline pipeline | Dev Tooling |

## 4. Animation & Smooth Scroll Stack

| Technology | Role | Ownership Rule | MVP Status |
|---|---|---|---|
| **GSAP + @gsap/react** | Timeline choreography, `ScrollTrigger` camera & section sequences | Owns scroll timelines & 3D camera rigs | Required |
| **Motion (`motion/react`)** | Declarative UI transitions (buttons, cards, menus, modals) | Owns UI micro-interactions & layout motion | Required |
| **Lenis** | Optional buttery smooth scrolling synced with ScrollTrigger | `AnimationProvider.jsx` (disabled on reduced motion) | Optional |
| **Three.js AnimationMixer** | Skeletal character animation clips (`idle`, `run`, `shoot`, etc.) | `PlayerAnimationController.jsx` | Required |

> **Ownership Rule:** Never allow GSAP, Motion, and CSS transitions to animate the same CSS property of the same DOM node simultaneously.

## 5. State, Forms & Data Fetching

| Technology | Role | Where Used | MVP Status |
|---|---|---|---|
| **Zustand** | Lightweight modular stores (`gameStore`, `playerStore`, `uiStore`, `audioStore`) | `src/store/` | Required |
| **TanStack React Query** | Async caching, hydration-safe queries for future API/Supabase endpoints | `QueryProvider.jsx`, `src/lib/queryClient.js` | Required |
| **React Hook Form + Zod** | Schema-validated forms (Support, Community signup, Squad export) | Support & interactive forms | Required |

## 6. Audio & Backend Readiness

| Technology | Role | Where Used | MVP Status |
|---|---|---|---|
| **Howler.js** | Cross-browser Web Audio / HTML5 audio sprites for stadium ambience & UI SFX | `src/lib/audio.js`, `useAudio.js` | Required (Opt-in only) |
| **@supabase/supabase-js** | Pre-configured optional client for future Auth, Postgres, and Storage | `src/lib/supabase.js` | Ready (Inactive until env set) |

## 7. Quality, Testing & DevOps Tools

| Technology | Role | Command |
|---|---|---|
| **ESLint (`eslint-config-next`)** | Static code & React/Next.js lint checks | `npm run lint` |
| **Prettier** | Deterministic code formatting | `npm run format` / `npm run format:check` |
| **Vitest + React Testing Library + jsdom** | Unit & component test suite | `npm run test` |
| **Playwright** | End-to-end, responsive, and navigation browser tests | `npm run test:e2e` |

## 8. Deferred or Excluded Packages

- **TypeScript (`typescript`, `@types/*`):** Intentionally excluded per project JavaScript/JSX mandate.
- **`framer-motion`:** Excluded because `motion` (the modern successor package) is installed; avoids duplicate animation runtimes.
- **`@theatre/core`, `@theatre/studio`, `@theatre/r3f`:** Deferred; GSAP + ScrollTrigger + `@gsap/react` already cover cinematic timeline orchestration without extra studio runtime weight or peer conflicts.

---

**Related Documents:** [04 — System Architecture](./SYSTEM_ARCHITECTURE.md) · [10 — Component Architecture](./COMPONENT_ARCHITECTURE.md)

