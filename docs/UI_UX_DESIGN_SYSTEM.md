# 06 — UI/UX Design System

## Table of Contents
1. [Brand Personality & Visual Direction](#1-brand-personality--visual-direction)
2. [Color Palette & Semantic Tokens](#2-color-palette--semantic-tokens)
3. [Typography System](#3-typography-system)
4. [Spacing, Grid & Elevation](#4-spacing-grid--elevation)
5. [Core UI Component Standards](#5-core-ui-component-standards)
6. [Responsive Breakpoints & Motion Rules](#6-responsive-breakpoints--motion-rules)

---

## 1. Brand Personality & Visual Direction

RIVALRY 90 rejects generic SaaS card aesthetics in favor of **floodlit stadium atmosphere**, sharp athletic geometry, subtle tactical pitch gridlines, and high-contrast telemetry readouts.

## 2. Color Palette & Semantic Tokens

| Token Name | HEX | Role |
|---|---|---|
| `--bg-primary` | `#0B0E11` | Deep Charcoal — main canvas background |
| `--bg-secondary` | `#12171D` | Night Tunnel — elevated panels & cards |
| `--bg-stadium-green` | `#0E1F18` | Dark Stadium Green — atmospheric gradient & turf surfaces |
| `--bg-surface-glass` | `rgba(18, 23, 29, 0.78)` | Frosted HUD overlay over 3D viewports |
| `--accent-lime` | `#B8FF2C` | Electric Lime — primary CTAs, active tabs, OVR highlights |
| `--accent-orange` | `#FF6B1A` | Football Orange — live match alerts, rivalry badges, heat indicators |
| `--text-primary` | `#F5F4EE` | Warm White — headlines & primary copy |
| `--text-secondary` | `#A3AEB8` | Cool Slate — body descriptions & metadata |
| `--border-subtle` | `rgba(245, 244, 238, 0.12)` | Hairline structural borders |
| `--status-success` | `#22C55E` | Verified / Ready / Optimal state |
| `--status-warning` | `#F59E0B` | Pending asset / Medium tier warning |
| `--status-error` | `#EF4444` | WebGL failure / Validation error |

### CSS Variable Example (`src/styles/tokens.css`)

```css
:root {
  --r90-bg-primary: #0b0e11;
  --r90-bg-secondary: #12171d;
  --r90-bg-stadium: #0e1f18;
  --r90-accent-lime: #b8ff2c;
  --r90-accent-orange: #ff6b1a;
  --r90-text-primary: #f5f4ee;
  --r90-text-secondary: #a3aeb8;
  --r90-border-subtle: rgba(245, 244, 238, 0.12);
  --r90-radius-sm: 0.375rem;
  --r90-radius-md: 0.75rem;
  --r90-radius-lg: 1.25rem;
  --r90-shadow-glow-lime: 0 0 28px rgba(184, 255, 44, 0.22);
}
```

## 3. Typography System

Configured via `next/font/google` in `src/app/layout.jsx`:

- **Display / Headlines (`--font-display`):** `Barlow Condensed` (Weights `600, 700, 800`), uppercase athletic tracking (`-0.01em` to `0.04em`).
- **Body / UI (`--font-sans`):** `Plus Jakarta Sans` or `Inter` (Weights `400, 500, 600, 700`), clean legibility on dark backgrounds.
- **Telemetry / Stats (`--font-mono`):** `JetBrains Mono` for player ratings, coordinates, FPS, and code commands.

| Scale Role | Desktop Size | Mobile Size | Line Height |
|---|---|---|---|
| Hero Display (`H1`) | `clamp(3rem, 7vw, 6.5rem)` | `2.75rem` | `0.94` |
| Section Heading (`H2`) | `clamp(2rem, 4vw, 3.5rem)` | `1.875rem` | `1.02` |
| Card Title (`H3`) | `1.375rem` | `1.125rem` | `1.2` |
| Body Copy | `1rem` | `0.9375rem` | `1.6` |
| Micro Label / Badge | `0.75rem` | `0.75rem` | `1.2` |

## 4. Spacing, Grid & Elevation

- **Container Max Width:** `1400px` (`max-w-7xl` to `max-w-[1400px]`) with `1rem` mobile, `2rem` tablet, and `3rem` desktop horizontal padding.
- **Section Rhythm:** `py-16 md:py-24 lg:py-32` for breathing room between full-bleed 3D and editorial bands.
- **Border Radius:** Crisp tactical corners (`6px`–`12px` for buttons/cards, `9999px` for status pills).

## 5. Core UI Component Standards

- **Primary Button:** Electric Lime (`#B8FF2C`) fill, Deep Charcoal (`#0B0E11`) bold uppercase text, subtle magnetic lift on desktop hover, `2px` focus-visible outline.
- **Secondary / Ghost Button:** Translucent `#12171D` fill with `1px solid rgba(245,244,238,0.18)` border, transitions to lime border on hover.
- **Athlete & Mode Cards:** Dark `#12171D` card with subtle top accent stripe, OVR badge in monospace, and clean hover state.
- **Inputs:** `#0B0E11` recessed field, `#F5F4EE` text, lime focus ring, inline Zod error messages in `#EF4444`.

## 6. Responsive Breakpoints & Motion Rules

| Breakpoint | Width | Layout Strategy |
|---|---|---|
| `sm` | `640px` | Wide mobile / compact 2-col grids |
| `md` | `768px` | Tablet 2-column layouts |
| `lg` | `1024px` | Desktop full navbar & split 3D/content panels |
| `xl` | `1280px` | Widescreen 3–4 column bento grids |
| `2xl` | `1536px` | Max-width cinema framing |

**Dark Theme Rule:** Dark mode is the native identity of RIVALRY 90; contrast between `#F5F4EE` text and `#0B0E11`/`#12171D` exceeds 14:1.

---

**Related Documents:** [05 — Sitemap](./WEBSITE_STRUCTURE_AND_SITEMAP.md) · [12 — Responsive & Accessibility](./RESPONSIVE_AND_ACCESSIBILITY_GUIDE.md)

