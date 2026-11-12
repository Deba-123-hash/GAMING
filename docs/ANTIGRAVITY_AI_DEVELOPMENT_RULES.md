# 15 — Antigravity AI Development Rules

## Table of Contents
1. [Mandatory Pre-Phase Checklist](#1-mandatory-pre-phase-checklist)
2. [Coding & Language Rules](#2-coding--language-rules)
3. [3D & Asset Rules](#3-3d--asset-rules)
4. [Animation Rules](#4-animation-rules)
5. [Post-Edit Verification Protocol](#5-post-edit-verification-protocol)

---

## 1. Mandatory Pre-Phase Checklist

Before starting any new development phase or feature:
1. Read [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md).
2. Read [PRODUCT_REQUIREMENTS_DOCUMENT.md](./PRODUCT_REQUIREMENTS_DOCUMENT.md).
3. Read [TECH_STACK.md](./TECH_STACK.md).
4. Read [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md).
5. Read the phase-specific document (e.g., `THREE_JS_3D_ARCHITECTURE.md` for 3D work).
6. Verify the previous phase is genuinely complete in [PROJECT_TASK_TRACKER.md](./PROJECT_TASK_TRACKER.md).

## 2. Coding & Language Rules

- **JavaScript ES6+ & JSX ONLY:** Never create `.ts`, `.tsx`, or `tsconfig.json`. Never recommend TypeScript.
- **No Duplicate Components:** Reuse primitives in `src/components/ui/`, `src/components/3d/`, and `src/lib/`.
- **Clean Architecture:** Keep page routes (`src/app/`) focused on composition; store static records in `src/data/`, shared helpers in `src/lib/` and `src/utils/`, and state in `src/store/`.
- **Zero Secrets:** Never hardcode API keys, database URLs, or passwords. Only use `.env.local` (gitignored) and `.env.example` placeholders.
- **No Fake Functionality or Broken Links:** Every route in `Navbar` and `Footer` must resolve cleanly; clearly label future backend features as preview/future scope.
- **Dependency Discipline:** Never install dependencies with `--force` or `--legacy-peer-deps`. Always inspect `package.json` first.

## 3. 3D & Asset Rules

- Prefer compressed `.glb` (Draco/Meshopt + KTX2/WebP).
- Lazy-load non-hero 3D scenes via `next/dynamic(..., { ssr: false })`.
- Use `THREE.InstancedMesh` for crowd figures and repeated props.
- Always implement WebGL capability checks (`useWebGLSupport`) and fallback posters.
- Never fabricate `.glb` files or import copyrighted real-world player/club assets.
- Log every external 3D asset in `docs/3D_ASSET_LICENSE_REGISTER.md` and `src/data/assetRegistry.js`.

## 4. Animation Rules

- **GSAP (`@gsap/react`):** Cinematic scroll sequences and 3D camera trajectories.
- **Motion (`motion/react`):** UI cards, drawers, buttons, modals, page transitions.
- **Three.js `AnimationMixer`:** 3D character skeletal animations.
- Never animate the same property on the same element with multiple libraries.
- Always clean up timelines inside `useGSAP` or `useEffect` return functions.
- Always respect `prefers-reduced-motion`.

## 5. Post-Edit Verification Protocol

After editing source files:
1. Run `npm run lint` and resolve all errors.
2. Run `npm run test` and verify tests pass.
3. Run `npm run build` for architectural or route changes.
4. Update `docs/PROJECT_TASK_TRACKER.md` honestly—never claim unverified work is complete.

---

**Related Documents:** [14 — Development Roadmap](./DEVELOPMENT_ROADMAP.md) · [18 — Project Task Tracker](./PROJECT_TASK_TRACKER.md)

