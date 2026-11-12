# Authentication Architecture (Phase 12)

## Credential Security
- **Password Hashing:** `src/server/security/passwordHash.js` uses Node's built-in `crypto.scryptSync` with a random 16-byte salt per credential (`salt:derivedKey`) and `crypto.timingSafeEqual` during verification. Passwords are never stored or returned in responses.
- **Public Registration:** `POST /api/auth/register` always creates accounts with `role: 'user'` and `status: 'active'`. Elevated roles cannot be requested through signup.

## Session Cookies
- Cookie name: `r90_session`
- Signing: HMAC-SHA256 payload signature + server-side session lookup in `sessionService.js`
- Flags: `HttpOnly`, `SameSite=Lax`, `Path=/`, `Secure` in production, 7-day `maxAge`
- Tokens are never stored in browser `localStorage` or `sessionStorage`.

## Recovery & Verification Flows
- **Forgot Password (`POST /api/auth/forgot-password`):** Always returns identical `200` acceptance message regardless of email existence to prevent account enumeration. Exposes `emailDelivered: false` when no email provider is configured.
- **Reset Password (`POST /api/auth/reset-password`):** Hashes submitted token (`sha256`), validates single-use & expiration, enforces password complexity policy, updates `passwordHash`, and immediately revokes **all** active sessions (`revokeAllUserSessions`).
- **Logout (`POST /api/auth/logout`):** Revokes server session record and clears cookie.
- **Suspended/Banned Accounts:** Denied sign-in (`403`) and immediately rejected by `resolveSessionFromToken()`.

