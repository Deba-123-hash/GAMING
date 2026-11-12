# 12 — Responsive Design & Accessibility Guide

## Table of Contents
1. [Multi-Device Layout Strategy](#1-multi-device-layout-strategy)
2. [Responsive 3D Adaptation](#2-responsive-3d-adaptation)
3. [Keyboard Navigation & Focus Management](#3-keyboard-navigation--focus-management)
4. [Screen Readers, Contrast & ARIA](#4-screen-readers-contrast--aria)
5. [Reduced Motion, Audio & WebGL Fallback](#5-reduced-motion-audio--webgl-fallback)

---

## 1. Multi-Device Layout Strategy

| Viewport | Breakpoint | Navigation | Grid & Typography |
|---|---|---|---|
| **Desktop / Ultrawide** | `>= 1280px` | Full horizontal `Navbar` + CTA | 3–4 column grids, full `clamp()` hero scale |
| **Laptop** | `1024px–1279px` | Compact `Navbar` | 2–3 column grids, split 3D + stats panels |
| **Tablet** | `768px–1023px` | `MobileNavigation` drawer | 2-column cards, stacked 3D showcase above controls |
| **Mobile** | `< 768px` | `MobileNavigation` slide-over drawer | Single-column stack, `44x44px` minimum touch targets |

## 2. Responsive 3D Adaptation

- **Camera FOV & Distance:** Adjust camera `fov` or Z-distance slightly on narrow portrait screens so the stadium pitch and player silhouette fit cleanly without horizontal clipping.
- **Touch Controls:** Keep `OrbitControls` optional or bounded so vertical page scrolling on mobile is never hijacked by an unintended 3D drag trap.

## 3. Keyboard Navigation & Focus Management

- All links, buttons, tabs, formation slots, and animation selectors are reachable via `Tab` / `Shift+Tab`.
- Include a `"Skip to main content"` link at the top of `RootLayout`.
- Visible focus ring (`focus-visible:outline-2 focus-visible:outline-[#b8ff2c] focus-visible:outline-offset-2`) on every interactive control.
- Mobile drawer traps focus while open and closes cleanly on `Escape`.

## 4. Screen Readers, Contrast & ARIA

- Semantic landmarks: `<header>`, `<nav aria-label="Main navigation">`, `<main id="main-content">`, `<footer>`.
- Decorative 3D `<Canvas>` containers include `aria-hidden="true"` or an accessible `aria-label` summary alongside HTML controls so screen-reader users get full functionality.
- Body text (`#F5F4EE` / `#A3AEB8`) against `#0B0E11` and `#12171D` maintains WCAG AA contrast (`>= 4.5:1`).

## 5. Reduced Motion, Audio & WebGL Fallback

- **Reduced Motion:** `useReducedMotion()` and `<MotionConfig reducedMotion="user">` disable auto-orbiting cameras, Lenis inertia, and parallax scrubs when requested by the OS.
- **Audio Controls:** Audio via Howler.js is **muted/off by default** (`audioStore.isEnabled = false`). Playback starts only after explicit user interaction on the navbar/HUD audio button.
- **WebGL Fallback:** Non-WebGL browsers receive a styled fallback stage with full HTML navigation, player stats, and squad builder parity.

---

**Related Documents:** [06 — UI/UX Design System](./UI_UX_DESIGN_SYSTEM.md) · [11 — Performance Optimization](./PERFORMANCE_OPTIMIZATION.md)

