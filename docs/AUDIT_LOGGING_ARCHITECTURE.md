# Audit Logging Architecture (Phase 17)

## Immutability & Sanitization
`src/server/services/auditService.js` implements an append-only audit log store (`store.auditLogs`, capped at `500` entries in development memory mode until Phases 18–20 PostgreSQL persistence):

- **No Mutation Endpoints:** `GET /api/admin/audit-logs` is strictly read-only (`audit.read`). There are no `PATCH`, `PUT`, or `DELETE` handlers for audit logs.
- **Automated Secret Redaction:** `metadata` passed into `recordAuditEvent()` runs through `sanitizeLogMeta()` (`src/server/utils/requestLogger.js`) to strip keys matching passwords, secrets, tokens, or authorization headers.

## Audited Actions Recorded
- **Auth:** `auth.register`, `auth.login`, `auth.login_failed`, `auth.logout`, `auth.password_reset_requested`, `auth.password_reset_completed`, `auth.email_verified`
- **Profile:** `profile.update`, `profile.preferences_update`, `profile.avatar_update`, `profile.avatar_remove`, `profile.deletion_requested`
- **Master Catalog & Squads:** `player.create`, `player.update`, `player.delete`, `team.create`, `team.update`, `team.delete`, `squad.create`, `squad.update`, `squad.delete`
- **CMS & Events:** `event.create`, `event.update`, `event.delete`, `event.register`, `news.create`, `news.update`, `news.delete`, `media.create`, `media.delete`
- **Admin Governance:** `admin.user_role_changed`, `admin.user_suspended`, `admin.user_banned`, `admin.user_reactivated`, `admin.category_created`, `admin.settings_updated`, `admin.sessions_revoked`

