# 01 — Project Overview: RIVALRY 90

## Table of Contents
1. [Project Introduction](#1-project-introduction)
2. [Brand Identity](#2-brand-identity)
3. [Problem Statement & Proposed Solution](#3-problem-statement--proposed-solution)
4. [Project Goals & Success Criteria](#4-project-goals--success-criteria)
5. [Target Audience & Devices](#5-target-audience--devices)
6. [Core Website Experience & USPs](#6-core-website-experience--usps)
7. [Scope Boundaries: What We Are vs. Are Not Building](#7-scope-boundaries-what-we-are-vs-are-not-building)
8. [MVP Scope & Future Expansion](#8-mvp-scope--future-expansion)

---

## 1. Project Introduction

**RIVALRY 90** is a next-generation, cinematic 3D football gaming website designed to present an original AAA-caliber football gaming universe directly in the browser. Built on **Next.js (App Router)**, **React**, **JavaScript/JSX**, **Three.js / React Three Fiber**, **GSAP**, and **Motion**, the platform combines real-time WebGL stadium scenes, interactive fictional player showcases, scroll-driven storytelling, and responsive gaming UI.

## 2. Brand Identity

| Attribute | Definition |
|---|---|
| **Project Name** | RIVALRY 90 |
| **Category** | Premium Football Gaming Website & Interactive 3D Showcase |
| **Brand Personality** | Cinematic, Competitive, Futuristic, Energetic, Authentic, High-Precision |
| **Visual Palette** | Deep Charcoal (`#0B0E11`), Dark Stadium Green (`#0E1F18`), Electric Lime (`#B8FF2C`), Football Orange (`#FF6B1A`), Warm White (`#F5F4EE`) |
| **Typography** | Bold condensed athletic display headlines + clean geometric sans-serif body + tabular monospace telemetry |
| **Originality Policy** | 100% original fictional players, clubs, stadiums, kits, and trophies. Zero copied logos, likenesses, or copyrighted third-party assets. |

## 3. Problem Statement & Proposed Solution

### Problem Statement
Most gaming websites rely on static promotional banners and heavy uncompressed video loops that feel disconnected from the energy of matchday football, fail to adapt gracefully on mobile devices, and offer shallow interactivity for squad-building or character inspection.

### Proposed Solution
RIVALRY 90 replaces passive landing pages with a **progressive, performance-budgeted 3D web experience**:
- Scroll-choreographed **GSAP camera journeys** from an aerial stadium floodlight reveal down through the tunnel onto the pitch.
- **Interactive 3D fictional player viewers** with swappable animation clips (idle, walk, run, dribble, shoot, celebrate).
- **Instanced crowd and atmospheric lighting systems** tuned to stay responsive across desktop, tablet, and mobile viewports.
- **Graceful fallback layers** (high-resolution posters/videos and reduced-motion modes) when WebGL or GPU budgets are constrained.

## 4. Project Goals & Success Criteria

1. Deliver a flagship studio-grade interactive showcase running smoothly at `http://localhost:3000` and in production.
2. Maintain strict **JavaScript + JSX** modularity without TypeScript overhead.
3. Achieve zero critical console/WebGL errors and graceful degradation on mobile or non-WebGL devices.
4. Keep initial page load lean by lazy-loading heavy 3D scenes and using Draco/Meshopt/KTX2 asset pipelines.
5. Maintain clean separation between frontend showcase state and future Supabase backend integration.

## 5. Target Audience & Devices

- **Primary Audience:** Competitive football gamers (ages 16–38), esports community members, football culture enthusiasts, and creative web/3D evaluators.
- **Target Devices:**
  - **Desktop / Ultrawide (1280px+):** Full 3D stadium, postprocessing bloom/vignette, high-poly hero player, instanced crowd, 60fps target.
  - **Tablet (768px–1279px):** Adaptive 3D viewport, simplified postprocessing, touch-friendly orbit/camera controls.
  - **Mobile (< 768px):** Lightweight 3D or curated video/image fallback depending on device tier, thumb-friendly bottom/drawer navigation.

## 6. Core Website Experience & USPs

- **8-Scene Cinematic Scroll Narrative:** Aerial stadium -> Tunnel -> Player Reveal -> Animation Lab -> Match Kickoff -> Squad Builder -> Trophy Finale.
- **Interactive Squad Builder Preview:** Formation selector (`4-3-3`, `4-2-3-1`, `3-5-2`) with fictional RIVALRY 90 athletes.
- **Original Fictional Universe:** Clubs like *Apex United*, *Valkyrie FC*, *Solstice Athletic*, and *Ironclad Rovers*.
- **Integrated `/resources/3d` Hub:** Built-in developer dashboard tracking 3D tools, asset licenses, and optimization pipelines.

## 7. Scope Boundaries: What We Are vs. Are Not Building

| In Scope (RIVALRY 90 Website) | Out of Scope (Separate Standalone Game) |
|---|---|
| Cinematic 3D stadium & pitch presentation | Full 11v11 real-time playable football match engine |
| Interactive 3D player model & clip viewer | Physics-driven ball/player multiplayer gameplay |
| Squad formation preview & player cards | Real-time online matchmaking & anti-cheat servers |
| Game modes, events, news, media, community pages | Native Unreal/Unity console/PC game client |
| Future-ready Supabase auth/data client setup | Production live-ops economy or real-money store |

## 8. MVP Scope & Future Expansion

- **MVP (Frontend-First):** Complete multi-page Next.js App Router site, design system, 3D Canvas foundation, hero stadium scene, player showcase, game modes, events, news, media gallery, and `/resources/3d` hub backed by structured static JS modules (`src/data/`).
- **Future Expansion:** Supabase authentication, persisted user squads, live tournament leaderboards, CMS-backed news/events, and optional companion WebGL mini-experiences.

---

**Related Documents:** [02 — PRD](./PRODUCT_REQUIREMENTS_DOCUMENT.md) · [03 — Tech Stack](./TECH_STACK.md) · [14 — Roadmap](./DEVELOPMENT_ROADMAP.md)

