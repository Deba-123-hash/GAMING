# RIVALRY 90 — Database Monitoring & Health Guide (Phase 20)

## Health Endpoints
- `GET /api/health` — General service & database configuration mode check.
- `GET /api/health/database` (`src/app/api/health/database/route.js`):
  - **Public Response:** Safe status summary (`provider`, `configured`, `connected`, `status`, `mode`, `latencyMs`, `pooling`, `migrationManifestCount`). Exposes zero secrets, URLs, or internal table diagnostics.
  - **Staff Response (`audit.read`):** Appends `diagnostics` (`migrations`, `hasDestructiveMigrations`, `integrity`, `backupStatus`, `environmentSeparation`).

## Admin UI Integration
- `/admin/security` (`src/app/admin/security/page.jsx`) consumes `GET /api/admin/security` to display real connection state, pooling mode, verified migration count, integrity anomaly count, and backup configuration status.
- Unconfigured environments display `not-configured` / `development-memory-fallback` honestly rather than synthetic uptime numbers.

