# Role-Based Access Control (Phase 17)

## Defined Roles (`src/server/auth/rbac.js`)
| Role ID | Label | Scope Summary |
|---|---|---|
| `super_admin` | Super Admin | Full access to all 19 permissions including `roles.manage`, `security.manage`, `settings.manage`, `users.ban` |
| `admin` | Admin | Manage users, roles readout, master players/teams, CMS content, analytics, and audit logs |
| `content_manager` | Content Manager | Manage events, news, media, categories, and view overview analytics |
| `moderator` | Moderator | Read users, suspend/reactivate accounts, and view overview analytics |
| `user` | User | Standard member (`permissions: []`); manages own profile, event registrations, and owned squads |

## Governance & Anti-Escalation Rules
1. Every protected Route Handler enforces `assertAuthenticated()` or `assertPermission()` on the server — UI hiding in `AdminShell` / `ProtectedRoute` is convenience only.
2. Public registration (`POST /api/auth/register`) always sets `role: 'user'`.
3. Administrators cannot modify their own role or suspend/ban their own account (`403`).
4. Only a `super_admin` may assign the `super_admin` role (`assertCanAssignRole`).
5. Demoting or suspending the final active `super_admin` is blocked (`409 CONFLICT`).
6. Standard `user` accounts can only read/write/delete squads matching `squad.userId === user.id`.

