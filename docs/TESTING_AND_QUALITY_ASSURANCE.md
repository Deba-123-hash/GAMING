# 13 — Testing & Quality Assurance Plan

## Table of Contents
1. [Testing Pyramid & Tooling](#1-testing-pyramid--tooling)
2. [Unit, Component & Integration Tests (Vitest)](#2-unit-component--integration-tests-vitest)
3. [Browser, Responsive & Navigation Tests (Playwright)](#3-browser-responsive--navigation-tests-playwright)
4. [3D Rendering & Performance Audits](#4-3d-rendering--performance-audits)
5. [Static Quality Gates (ESLint & Prettier)](#5-static-quality-gates-eslint--prettier)
6. [Release Acceptance Criteria](#6-release-acceptance-criteria)

---

## 1. Testing Pyramid & Tooling

| Layer | Tool | Target Scope | Command |
|---|---|---|---|
| **Lint & Formatting** | ESLint + Prettier | JS/JSX syntax, React hooks rules, formatting consistency | `npm run lint` / `npm run format:check` |
| **Unit & Data** | Vitest | `utils/`, `validators.js`, `formatters.js`, `src/data/*`, Zustand stores | `npm run test` |
| **Component** | Vitest + React Testing Library + jsdom | `Navbar`, `Footer`, `PlayerCard`, `ErrorFallback`, `/resources/3d` filters | `npm run test` |
| **E2E & Responsive** | Playwright | Route navigation, mobile drawer, desktop/tablet/mobile viewports | `npm run test:e2e` |
| **3D & WebGL** | Chrome DevTools + Spector.js + `gltf-validator` | Draw calls, shader compiles, GLB compliance, zero context leaks | Manual / `npm run assets:validate` |
| **Performance** | Lighthouse | LCP, CLS, accessibility, best practices, SEO | Chrome DevTools / CI |

## 2. Unit, Component & Integration Tests (Vitest)

- Configured in `vitest.config.js` with `jsdom` environment, `@testing-library/jest-dom` setup (`tests/setup.js`), and `@/` path alias resolution.
- **3D Mocking Policy:** Because `jsdom` lacks a full WebGL2 context, unit/component tests mock `@react-three/fiber` Canvas where testing UI overlays, while Playwright verifies real WebGL canvas mounting in Chromium.

## 3. Browser, Responsive & Navigation Tests (Playwright)

- Configured in `playwright.config.js` across three device profiles:
  - `chromium` (Desktop Chrome)
  - `tablet` (iPad gen 7)
  - `mobile` (Pixel 7)
- Tests verify zero console errors, all primary routes return HTTP 200, mobile navigation opens/closes cleanly, and `/resources/3d` search/filter controls update results.

## 4. 3D Rendering & Performance Audits

- **Spector.js:** Capture WebGL frames during stadium & player scenes to confirm draw-call counts stay within budget and `InstancedMesh` is batching crowd geometry.
- **Memory Checks:** Navigate across `/` -> `/stadium` -> `/players` -> `/` and confirm GPU memory does not climb unboundedly.

## 5. Static Quality Gates (ESLint & Prettier)

- Every phase ends with `npm run lint`, `npm run test`, and `npm run build` passing with zero errors.

## 6. Release Acceptance Criteria

- [ ] `npm run lint` passes with zero errors.
- [ ] `npm run test` passes 100% of unit/component tests.
- [ ] `npm run build` produces a clean production Next.js bundle.
- [ ] All routes navigable without 404s or broken links.
- [ ] No TypeScript files (`.ts`/`.tsx`) introduced.
- [ ] All external asset licenses logged in `docs/3D_ASSET_LICENSE_REGISTER.md`.

---

**Related Documents:** [14 — Development Roadmap](./DEVELOPMENT_ROADMAP.md) · [15 — AI Development Rules](./ANTIGRAVITY_AI_DEVELOPMENT_RULES.md)

