# 10 — React Component Architecture

## Table of Contents
1. [App Router Server vs. Client Strategy](#1-app-router-server-vs-client-strategy)
2. [Component Directory & Responsibilities](#2-component-directory--responsibilities)
3. [Key Reusable Components](#3-key-reusable-components)
4. [Custom Hooks & Zustand Stores](#4-custom-hooks--zustand-stores)
5. [Naming & Coding Conventions](#5-naming--coding-conventions)

---

## 1. App Router Server vs. Client Strategy

- **Server Components (Default):** `src/app/**/page.jsx` and `src/app/layout.jsx` remain Server Components to export `metadata`, read static `src/data/` modules directly, and avoid shipping unnecessary client JS.
- **Client Components (`'use client'`):** Isolated to interactive UI (`Navbar`, `SquadBuilder`, `PlayerFilters`, `MediaGallery`, `/resources/3d` dashboard), Zustand consumers, Motion/GSAP animation wrappers, and all React Three Fiber 3D components.

## 2. Component Directory & Responsibilities

| Directory | Purpose | Examples |
|---|---|---|
| `src/components/layout/` | Global shell, navbars, footer, page transitions | `Navbar.jsx`, `MobileNavigation.jsx`, `Footer.jsx`, `PageContainer.jsx`, `PageTransition.jsx`, `Preloader.jsx` |
| `src/components/ui/` | Atomic design-system primitives | `Button.jsx`, `Container.jsx`, `SectionHeading.jsx`, `Badge.jsx`, `LoadingScreen.jsx`, `ErrorFallback.jsx`, `ScrollIndicator.jsx` |
| `src/components/3d/` | WebGL Canvas, stadium, pitch, player, crowd, camera, lighting | `CanvasWrapper.jsx`, `SceneManager.jsx`, `StadiumScene.jsx`, `FootballPitch.jsx`, `PlayerModel.jsx`, `CrowdSystem.jsx`, `CameraRig.jsx`, `Lighting.jsx` |
| `src/components/animations/` | GSAP, Lenis, and Motion orchestration helpers | `AnimationProvider.jsx`, `HeroAnimation.jsx`, `ScrollScenes.jsx`, `TextReveal.jsx`, `MagneticButton.jsx`, `MotionWrapper.jsx` |
| `src/components/sections/` | Page-level composition bands | `HeroSection.jsx`, `StadiumSection.jsx`, `PlayerShowcase.jsx`, `GameModesSection.jsx`, `SquadSection.jsx`, `EventsSection.jsx`, `NewsSection.jsx`, `CommunitySection.jsx`, `FinalCTASection.jsx` |
| `src/components/players/` | Athlete cards, stats bars, filters, clip selectors | `PlayerCard.jsx`, `PlayerStats.jsx`, `PlayerProfile.jsx`, `PlayerFilters.jsx`, `PlayerAnimationSelector.jsx` |
| `src/components/teams/` | Club cards and tactical profiles | `TeamCard.jsx`, `TeamProfile.jsx` |
| `src/components/squad/` | Interactive formation & lineup builder | `SquadBuilder.jsx`, `FormationSelector.jsx`, `SquadPlayerSlot.jsx` |
| `src/components/game-modes/` | Mode cards | `GameModeCard.jsx` |
| `src/components/events/` | Tournament cards and details | `EventCard.jsx`, `EventDetails.jsx` |
| `src/components/news/` | News grid and editorial cards | `NewsCard.jsx`, `NewsGrid.jsx` |
| `src/components/media/` | Media gallery with filtering & preview modal | `MediaGallery.jsx` |

## 3. Key Reusable Components (JSX Example)

```jsx
'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ErrorFallback from '@/components/ui/ErrorFallback';
import useWebGLSupport from '@/hooks/useWebGLSupport';

export default function CanvasWrapper({ children, camera = { position: [0, 8, 18], fov: 45 } }) {
  const { supported } = useWebGLSupport();
  if (!supported) return <ErrorFallback title="WebGL Unavailable" />;

  return (
    <Suspense fallback={<LoadingScreen label="Initializing 3D Pitch..." />}>
      <Canvas shadows dpr={[1, 2]} camera={camera}>
        {children}
      </Canvas>
    </Suspense>
  );
}
```

## 4. Custom Hooks & Zustand Stores

- **Hooks (`src/hooks/`):** `usePlayerAnimation`, `useScrollScene`, `useMediaQuery`, `useReducedMotion`, `useWebGLSupport`, `useDevicePerformance`, `useAudio`.
- **Stores (`src/store/`):** `gameStore`, `playerStore`, `uiStore`, `audioStore`. Keep isolated component UI state (e.g., dropdown open state) in local `useState`, not global Zustand stores.

## 5. Naming & Coding Conventions

- Components: `PascalCase.jsx` (`PlayerCard.jsx`).
- Hooks: `camelCase.js` prefixed with `use` (`useWebGLSupport.js`).
- Utilities & Data: `camelCase.js` (`assetPaths.js`, `gameModes.js`).
- **Strict Language Rule:** JavaScript ES6+ and `.jsx` only. Zero TypeScript.

---

**Related Documents:** [04 — System Architecture](./SYSTEM_ARCHITECTURE.md) · [15 — AI Development Rules](./ANTIGRAVITY_AI_DEVELOPMENT_RULES.md)

