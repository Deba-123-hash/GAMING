# RIVALRY 90 — Email Service Integration

- **Selected Provider:** **Resend** (`https://api.resend.com/emails`, docs: `https://resend.com/docs/api-reference/emails/send-email`).
- **Free Tier Quotas:** `3,000` emails/month, `100` emails/day (UTC calendar reset), `10 req/sec`, verified sending domain (`EMAIL_FROM_ADDRESS`).
- **Safety Guarantees (`src/services/external/emailService.js`):**
  - Requires server-only `RESEND_API_KEY`. When unset, reports `{ configured: false, sent: false }` honestly (matching Phase 12 `forgot-password` / `register` responses).
  - Explicitly suppresses live sends when `NODE_ENV === 'test'` (`testSuppressed: true`) so automated test suites never email real recipients.

