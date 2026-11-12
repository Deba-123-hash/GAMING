# RIVALRY 90 — API Authorization Guide

- Role & permission checks live in `src/server/auth/rbac.js` (`assertPermission(session, permission)`).
- Every admin and CMS write endpoint enforces server-side RBAC:
  - Players CRUD: `players.create`, `players.update`, `players.delete`
  - Teams CRUD: `teams.manage`
  - Events / News / Media CMS: `events.manage`, `news.manage`, `media.manage`
  - Admin Dashboard / Analytics / Users / Roles / Audit / Security / Settings: `analytics.read`, `users.read`, `users.update`, `users.suspend`, `users.ban`, `roles.read`, `audit.read`, `security.manage`, `settings.manage`
- **IDOR Prevention:** `squadService` verifies `squad.userId === user.id` on all squad reads, updates, slot edits, formation switches, captain assignments, and AI squad analyses (`403 FORBIDDEN` otherwise).
- **Draft Isolation:** Unauthenticated/ordinary callers cannot pass `?includeDrafts=true` to read unpublished players, teams, events, news, or media.

