# 11 — Performance Optimization Strategy

## Table of Contents
1. [Realistic Performance Targets](#1-realistic-performance-targets)
2. [Initial Load & Code Splitting](#2-initial-load--code-splitting)
3. [3D GPU, Draw-Call & Memory Budgets](#3-3d-gpu-draw-call--memory-budgets)
4. [Device Tiering & Adaptive Quality](#4-device-tiering--adaptive-quality)
5. [Image, Video & Offscreen Optimizations](#5-image-video--offscreen-optimizations)

---

## 1. Realistic Performance Targets

| Metric | Desktop Target | Mobile Target | Notes |
|---|---|---|---|
| **LCP (Largest Contentful Paint)** | `<= 2.5s` | `<= 3.2s` | Hero typography & poster paint before heavy GLB streams |
| **CLS (Cumulative Layout Shift)** | `< 0.05` | `< 0.05` | Fixed aspect ratios on 3D containers & media cards |
| **INP (Interaction to Next Paint)** | `< 150ms` | `< 200ms` | Avoid blocking main thread during GLTF decode |
| **3D Frame Rate** | `50–60 fps` (high tier) | `30–45 fps` (medium/low) | Degrades cleanly rather than throttling device thermals |

## 2. Initial Load & Code Splitting

- Load the **hero 3D scene first**; secondary 3D viewers (`PlayerViewer`, `StadiumScene`) use `next/dynamic(..., { ssr: false })`.
- Never bundle all player or stadium `.glb` assets into the initial page payload.
- Preload critical fonts via `next/font/google`.

## 3. 3D GPU, Draw-Call & Memory Budgets

- **Draw Calls:** Target `< 120` draw calls in the main stadium view by merging static structural meshes in Blender and using `THREE.InstancedMesh` for crowd seats/fans and pitch corner props.
- **Compression:** Apply Draco or Meshopt geometry compression and KTX2/Basis or WebP textures via `@gltf-transform/cli`.
- **Shadows:** Restrict real-time shadow casting to 1 primary directional/spot key light; bake ambient occlusion into stadium textures where practical.
- **Postprocessing:** Enable `EffectComposer` + `Bloom` only on `high` GPU tiers; disable on mobile and low-tier devices.
- **Memory Cleanup:** Dispose geometries, materials, and textures on scene unmount; avoid retaining unused `AnimationMixer` instances.

## 4. Device Tiering & Adaptive Quality

`useDevicePerformance()` classifies runtime capability into `high`, `medium`, or `low` using `navigator.hardwareConcurrency`, `navigator.deviceMemory`, viewport size, and `prefers-reduced-motion`:

| Tier | DPR | Shadows | Crowd Instances | Postprocessing |
|---|---|---|---|---|
| `high` (Desktop GPU) | `[1, 2]` | `2048px` soft | `2,500 – 4,000` | Enabled (subtle bloom) |
| `medium` (Laptop / Tablet) | `[1, 1.5]` | `1024px` basic | `800 – 1,500` | Disabled |
| `low` (Mobile / Battery Saver) | `1` | Disabled | `0 – 400` or static fallback | Disabled |

## 5. Image, Video & Offscreen Optimizations

- Serve images via `next/image` with `AVIF` and `WebP` enabled in `next.config.mjs`.
- Pause 3D render loops or reduce tick frequency when a `<Canvas>` is scrolled outside the viewport (`IntersectionObserver`).
- Always provide a high-contrast static fallback image/card when WebGL is blocked or context is lost.

---

**Related Documents:** [07 — 3D Architecture](./THREE_JS_3D_ARCHITECTURE.md) · [09 — 3D Asset Pipeline](./3D_ASSET_PIPELINE.md)

