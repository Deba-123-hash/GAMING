# 17 — Deployment & DevOps Guide

> **Status:** PLANNING DOCUMENT. Do not deploy production infrastructure until Phase 12 QA passes.

## Table of Contents
1. [Git Workflow & Repository Hygiene](#1-git-workflow--repository-hygiene)
2. [Environment Variables](#2-environment-variables)
3. [Vercel Build & Preview Pipeline](#3-vercel-build--preview-pipeline)
4. [Cloudflare CDN & Asset Caching](#4-cloudflare-cdn--asset-caching)
5. [Monitoring & Rollback Strategy](#5-monitoring--rollback-strategy)

---

## 1. Git Workflow & Repository Hygiene

- `main`: Protected production branch; deploys automatically after verification.
- `feat/<phase-or-feature>`: Short-lived feature branches merged after `npm run lint`, `npm run test`, and `npm run build` succeed.
- `.gitignore` excludes `node_modules/`, `.next/`, `.env*.local`, test artifacts, and temp logs.

## 2. Environment Variables

Configure in Vercel Project Settings (never commit secrets):

| Variable | Scope | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Client & Server | Canonical production URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | Optional Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | Public anon key (RLS protected) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Only | Privileged backend key (future API routes) |
| `NEXT_PUBLIC_SENTRY_DSN` | Client & Server | Optional Sentry DSN (Phase 12) |

## 3. Vercel Build & Preview Pipeline

- **Install Command:** `npm ci`
- **Build Command:** `npm run build`
- **Node.js Version:** `20.x` or `22.x` LTS (or matching Vercel runtime).
- Pull requests automatically generate isolated Vercel Preview URLs for Playwright E2E and Lighthouse verification.

## 4. Cloudflare CDN & Asset Caching

- Place Cloudflare DNS/CDN in front of custom domain when live.
- Configure long-lived `Cache-Control: public, max-age=31536000, immutable` on versioned `.glb`, `.ktx2`, and `.woff2` assets in `public/`.

## 5. Monitoring & Rollback Strategy

- **Web Vitals & Analytics:** Enable Vercel Analytics / Speed Insights during Phase 12.
- **Error Tracking:** Optional Sentry SDK integration with source maps.
- **Rollback:** Instant one-click deployment promotion to the previous verified immutable build in Vercel Dashboard if regressions appear.

---

**Related Documents:** [13 — QA & Testing](./TESTING_AND_QUALITY_ASSURANCE.md) · [16 — Database & Backend Plan](./DATABASE_AND_BACKEND_PLAN.md)

