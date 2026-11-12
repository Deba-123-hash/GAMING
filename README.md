# RIVALRY 90 — Next-Generation 3D Football Gaming Website

**RIVALRY 90** is a cinematic, next-generation football gaming website and 3D showcase built with **Next.js App Router, React 19, JavaScript (ES6+), JSX, Tailwind CSS v4, Three.js, React Three Fiber, GSAP, and Motion for React**.

> **Scope Note:** This repository is the official **RIVALRY 90 web showcase & interactive 3D hub**, not a standalone playable 11v11 football match simulation. All characters, clubs, kits, and stadiums are original fictional creations.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template (optional for frontend-only dev)
cp .env.example .env.local

# 3. Start development server
npm run dev
```

Open **http://localhost:3000** in your browser.
Explore the built-in **3D Development Hub** at **http://localhost:3000/resources/3d**.

---

## Development Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js development server at `http://localhost:3000` |
| `npm run build` | Create optimized production build |
| `npm run start` | Serve production build locally |
| `npm run lint` | Run ESLint across the repository |
| `npm run format` | Format JS/JSX/CSS files with Prettier |
| `npm run format:check` | Verify formatting without modifying files |
| `npm run test` | Run Vitest unit and component tests |
| `npm run test:e2e` | Run Playwright browser & responsive E2E tests |
| `npm run assets:validate` | Validate `public/` asset folders and `src/data/assetRegistry.js` |

---

## Technology Stack

- **Framework:** Next.js 16 (App Router), React 19, JavaScript ES6+ & JSX (zero TypeScript)
- **Styling & UI:** Tailwind CSS v4, Radix UI primitives, shadcn/ui conventions, Lucide React
- **3D Web:** Three.js, `@react-three/fiber` v9, `@react-three/drei` v10, `@react-three/postprocessing`, `@react-three/rapier`
- **3D Tooling:** `@gltf-transform/cli`, `gltf-validator`, `gltfjsx`, `leva` (dev)
- **Animation:** GSAP + ScrollTrigger + `@gsap/react`, Motion (`motion/react`), Lenis, Three.js `AnimationMixer`
- **State, Forms & Data:** Zustand, React Hook Form, Zod, TanStack React Query
- **Audio & Backend-Ready:** Howler.js (user-activated only), `@supabase/supabase-js` (inactive until credentials configured)
- **Testing & Quality:** Vitest, React Testing Library, Playwright, ESLint, Prettier

---

## Project Architecture

```text
rivalry90 (D:\GAMING)
├── docs/                  # Complete 22-document engineering & 3D knowledge base
├── public/                # Static 3D models, animations, textures, HDRIs, images, audio
├── scripts/               # Asset validation & GLB optimization helpers
├── src/
│   ├── app/               # Next.js App Router pages & layouts (+ /resources/3d)
│   ├── components/        # Layout, UI, 3D, animation, section, and feature components
│   ├── data/              # Fictional universe data, navigation, 3D resource & asset registries
│   ├── hooks/             # Custom React hooks (WebGL, performance, audio, reduced motion)
│   ├── lib/               # Shared singletons (GSAP, Three helpers, Supabase, audio, constants)
│   ├── providers/         # AppProviders, QueryProvider, MotionProvider
│   ├── store/             # Zustand stores (game, player, ui, audio)
│   ├── styles/            # Design tokens, animations, 3D, and responsive CSS
│   └── utils/             # Asset paths, formatters, device detection, performance, validators
└── tests/                 # Unit, component, integration, and Playwright E2E tests
```

---

## 3D Asset Pipeline & Licensing Rules

1. Author or edit original fictional assets in **Blender** (`1 unit = 1m`, `+Y` up) and rig/animate via **Mixamo** or **Cascadeur**.
2. Export binary `.glb` and validate with `npx gltf-validator <file>.glb`.
3. Optimize with `npx gltf-transform optimize input.glb output.glb --compress draco --texture-compress webp`.
4. Place assets in the matching `public/` directory, register them in `src/data/assetRegistry.js`, and record commercial license compliance in [docs/3D_ASSET_LICENSE_REGISTER.md](./docs/3D_ASSET_LICENSE_REGISTER.md).

---

## Documentation Index

Start with [docs/README.md](./docs/README.md) for the recommended 18-document reading order covering architecture, 3D systems, animation choreography, performance budgets, QA, roadmap, and AI development rules.

