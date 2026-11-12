# RIVALRY 90 — Internal API Reference (Phase 21)

See also OpenAPI specification at [openapi.yaml](./openapi.yaml).

| Group | Endpoints |
|---|---|
| Health & Meta | `GET /api`, `GET /api/health`, `GET /api/health/database`, `GET /api/version` |
| Auth (Phase 12) | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/session`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`, `POST /api/auth/verify-email`, `GET /api/auth/callback` |
| Profile (Phase 13/21) | `GET/PATCH /api/profile`, `POST/DELETE /api/profile/avatar`, `GET/PATCH /api/profile/preferences`, `GET/PATCH /api/profile/settings`, `GET/PATCH /api/profile/privacy`, `POST /api/profile/delete-request`, `GET /api/users/[username]` |
| Players & Teams | `GET/POST /api/players`, `GET /api/players/featured`, `GET /api/players/search`, `GET/PATCH/DELETE /api/players/[playerId]`, `GET/POST /api/teams`, `GET /api/teams/search`, `GET/PATCH/DELETE /api/teams/[teamId]`, `GET /api/teams/[teamId]/players` |
| Modes & Squads | `GET /api/game-modes`, `GET /api/game-modes/categories`, `GET /api/game-modes/[slug]`, `GET /api/stadiums`, `GET /api/formations`, `GET/POST /api/squads`, `GET/PATCH/DELETE /api/squads/[squadId]`, `POST/PUT /api/squads/[squadId]/players`, `DELETE /api/squads/[squadId]/players/[playerId]`, `PATCH /api/squads/[squadId]/formation`, `PATCH /api/squads/[squadId]/captain` |
| Events, News, Media | `GET/POST /api/events`, `GET /api/events/categories`, `GET/PATCH/DELETE /api/events/[slug]`, `POST/DELETE /api/events/[slug]/register`, `GET /api/events/[slug]/registrations`, `GET/POST /api/news`, `GET /api/news/categories`, `GET /api/news/featured`, `GET/PATCH/DELETE /api/news/[slug]`, `GET/POST /api/media`, `GET /api/media/categories`, `GET /api/media/featured`, `GET/PATCH/DELETE /api/media/[id]`, `POST /api/support` |
| Admin (Phase 17) | `GET /api/admin/dashboard`, `GET /api/admin/analytics`, `GET /api/admin/users`, `GET/PATCH /api/admin/users/[id]`, `POST /api/admin/users/[id]/suspend`, `POST /api/admin/users/[id]/reactivate`, `GET /api/admin/roles`, `GET /api/admin/audit-logs`, `GET/POST /api/admin/security`, `GET/PATCH /api/admin/settings`, `GET/POST /api/admin/categories` |

