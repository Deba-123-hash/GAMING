# RIVALRY 90 — REST API Documentation (Phases 11–17)

## Standard Response Envelope
All `/api/*` Next.js Route Handlers use `src/server/utils/apiResponse.js` and `src/server/utils/errorHandler.js`:

**Success (`2xx`):**
```json
{
  "success": true,
  "ok": true,
  "message": "Human-readable status",
  "data": {},
  "meta": { "requestId": "uuid" }
}
```

**Error (`4xx` / `5xx`):**
```json
{
  "success": false,
  "ok": false,
  "message": "Safe user-facing error",
  "error": { "code": "ERROR_CODE", "details": {} },
  "meta": { "requestId": "uuid" }
}
```

## Endpoints by Phase

### Phase 11 — System & Health
- `GET /api` — API index & metadata
- `GET /api/health` — Runtime health & database mode (`development-memory-fallback` when Supabase credentials are unset)
- `GET /api/version` — Application & API version (`1.0.0`)

### Phase 12 — Authentication
- `POST /api/auth/register` — Registers `user` account (`scryptSync` hash), creates profile, sets `r90_session` `HttpOnly` cookie
- `POST /api/auth/login` — Verifies email/password, sets `r90_session` cookie
- `POST /api/auth/logout` — Revokes active session ID & clears `r90_session` cookie
- `GET /api/auth/session` — Returns active session user & profile or `{ authenticated: false }`
- `POST /api/auth/forgot-password` — Non-enumerating password reset request (`emailDelivered: false` without email provider)
- `POST /api/auth/reset-password` — Consumes single-use reset token, updates password, revokes all active sessions
- `POST /api/auth/verify-email` — Consumes verification token
- `GET /api/auth/callback` — Sanitizes `?next=` to prevent open redirects

### Phase 13 — User Profiles
- `GET /api/profile`, `PATCH /api/profile` — Private authenticated profile read/update
- `POST /api/profile/avatar`, `DELETE /api/profile/avatar` — Validates JPEG/PNG/WebP `<= 2 MB`
- `GET /api/profile/preferences`, `PATCH /api/profile/preferences` — Theme, notifications, visibility rules
- `GET /api/users/[username]` — Privacy-filtered public profile (never returns email or credentials)
- `POST /api/profile/delete-request` — Audited account deletion request

### Phase 14 — Players & Teams
- `GET /api/players` — Filter (`position`, `teamId`, `nationality`, `minOvr`, `maxOvr`, `search`, `sort`, `page`, `pageSize`); `?includeDrafts=true` requires `players.update`
- `POST /api/players` — Create master player (`players.create`), computes weighted OVR, checks team shirt-number uniqueness
- `GET /api/players/[playerId]`, `PATCH`, `DELETE` — Detail, update (`players.update`), delete (`players.delete`)
- `GET /api/teams`, `POST /api/teams` — Filter (`type`, `country`, `search`, `sort`); create (`teams.manage`)
- `GET /api/teams/[teamId]`, `PATCH`, `DELETE` — Delete blocks if team still owns players
- `GET /api/teams/[teamId]/players` — Published team roster

### Phase 15 — Game Modes & Squads
- `GET /api/game-modes` — Lists all 8 core game modes
- `GET /api/stadiums` — Lists RIVALRY 90 stadiums
- `GET /api/squads`, `POST /api/squads` — Authenticated squad listing & creation (11 starting slots + up to 7 substitutes, server-side rating calculation)
- `GET /api/squads/[squadId]`, `PATCH`, `DELETE` — Strict owner-only access (`403` on non-owner)
- `PUT /api/squads/[squadId]/players` — Replace lineup slots/subs
- `PATCH /api/squads/[squadId]/formation` — Switch among 10 supported formations
- `PATCH /api/squads/[squadId]/captain` — Set captain from active squad roster

### Phase 16 — Events, News, Media & Support
- `GET /api/events`, `POST /api/events` (`events.manage`), `GET/PATCH/DELETE /api/events/[slug]`
- `POST /api/events/[slug]/register` — Authenticated event registration
- `GET /api/news`, `POST /api/news` (`news.manage`), `GET/PATCH/DELETE /api/news/[slug]`
- `GET /api/media`, `POST /api/media` (`media.manage`), `DELETE /api/media/[id]`
- `POST /api/support` — Zod-validated support ticket endpoint

### Phase 17 — Admin & Security
- `GET /api/admin/dashboard` (`analytics.read`)
- `GET /api/admin/users` (`users.read`), `GET /api/admin/users/[id]`, `PATCH /api/admin/users/[id]` (`users.update`)
- `POST /api/admin/users/[id]/suspend` (`users.suspend` / `users.ban`), `POST /api/admin/users/[id]/reactivate` (`users.suspend`)
- `GET /api/admin/roles` (`roles.read`)
- `GET /api/admin/audit-logs` (`audit.read`, immutable append-only)
- `GET /api/admin/security` (`audit.read`), `POST /api/admin/security` (`security.manage`)
- `GET /api/admin/settings` (`analytics.read`), `PATCH /api/admin/settings` (`settings.manage`)
- `GET /api/admin/categories` (`analytics.read`), `POST /api/admin/categories` (`categories.manage`)

