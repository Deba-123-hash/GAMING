# 08 — Animation & Interaction Guide

## Table of Contents
1. [Animation Ownership Matrix](#1-animation-ownership-matrix)
2. [GSAP & ScrollTrigger Setup](#2-gsap--scrolltrigger-setup)
3. [Motion for React & Lenis](#3-motion-for-react--lenis)
4. [8-Scene Cinematic Scroll Storyboard](#4-8-scene-cinematic-scroll-storyboard)
5. [Reduced Motion & Performance Safeguards](#5-reduced-motion--performance-safeguards)

---

## 1. Animation Ownership Matrix

Strict single-owner discipline prevents jitter and conflicting transforms:

| Element / Target | Owner Library | Never Controlled By |
|---|---|---|
| Scroll-driven sections & 3D `CameraRig` waypoints | **GSAP + ScrollTrigger (`@gsap/react`)** | Motion, CSS transitions |
| Navbar, mobile drawer, cards, buttons, modals, page transitions | **Motion (`motion/react`)** | GSAP |
| 3D character skeleton (`idle`, `run`, `dribble`, `shoot`, `celebration`) | **Three.js `AnimationMixer`** | GSAP, Motion |
| Smooth scroll inertia (optional desktop) | **Lenis** | Custom wheel listeners |
| Simple hover borders, loading spinners | **CSS Transitions / Keyframes** | GSAP, Motion |

## 2. GSAP & ScrollTrigger Setup

- Centralized in `src/lib/gsap.js`: registers `ScrollTrigger` once inside a `typeof window !== 'undefined'` guard.
- Components use `useGSAP(() => { ... }, { scope: containerRef })` from `@gsap/react` so React 19 Strict Mode double-mounting automatically reverts timelines cleanly without memory leaks.

## 3. Motion for React & Lenis

- `MotionProvider.jsx` wraps the app in `<MotionConfig reducedMotion="user">`.
- `AnimationProvider.jsx` optionally initializes `Lenis` on desktop (`>= 1024px`) only when `useReducedMotion()` is `false`, piping `lenis.on('scroll', ScrollTrigger.update)` and cleaning up on unmount.

## 4. 8-Scene Cinematic Scroll Storyboard

| Scene | Trigger / Scroll Band | Initial State | Camera & Object Motion | Transition & Ending State |
|---|---|---|---|---|
| **Scene 1: Aerial Stadium Reveal** | `0% – 12%` (Hero entry) | High altitude above stadium roof, floodlights flaring through dark haze | GSAP gently orbits camera `y: 42 -> 34`, floodlight beams sweep slowly | Crossfade hero typography out as scroll advances |
| **Scene 2: Descent Into Bowl** | `12% – 25%` | Camera above outer rim looking down at lit pitch | Camera dives smoothly past upper stands toward goal-end | Pitch markings & LED boards sharpen into focus |
| **Scene 3: Tunnel Entrance** | `25% – 38%` | Camera positioned inside dark stadium tunnel mouth | Dolly forward from shadow into bright electric-lime pitch light | Tunnel vignette opens to full-width pitch |
| **Scene 4: Football Player Reveal** | `38% – 52%` | Hero fictional striker silhouette backlit at center circle | Camera tracks 120° around player; rim light intensifies | Player steps from `idle` clip into ready stance |
| **Scene 5: Player Animation Showcase** | `52% – 66%` | Player centered in interactive showcase stage | User or scroll triggers clip crossfades (`running` -> `dribbling` -> `shooting`) | Camera tightens on boots and ball contact |
| **Scene 6: Match Kickoff** | `66% – 78%` | Wide broadcast-angle pitch view with crowd wave | Instanced crowd rises in wave; ball arcs toward goal | Flash transition into tactical overlay |
| **Scene 7: Squad-Building Interface** | `78% – 90%` | 3D camera tilts into top-down tactical pitch angle | Motion reveals interactive `SquadBuilder` formation slots | Seamlessly hands focus to UI card interactions |
| **Scene 8: Trophy & Championship Reveal** | `90% – 100%` | Pedestal lit by electric lime & warm gold spotlights | `TrophyModel` rotates smoothly; atmospheric embers rise | Final CTA section locks cleanly at page footer |

## 5. Reduced Motion & Performance Safeguards

- When `prefers-reduced-motion: reduce` is active:
  - Lenis smooth scrolling is disabled.
  - GSAP scroll scrubbing is bypassed in favor of static section anchors.
  - 3D camera auto-orbit and crowd wave animations pause; static hero framing is preserved.
- Offscreen `<Canvas>` loops pause via `frameloop="demand"` or visibility observers when scrolled out of view.

---

**Related Documents:** [07 — 3D Architecture](./THREE_JS_3D_ARCHITECTURE.md) · [12 — Responsive & Accessibility](./RESPONSIVE_AND_ACCESSIBILITY_GUIDE.md)

