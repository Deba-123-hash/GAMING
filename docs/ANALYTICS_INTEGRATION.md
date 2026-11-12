# RIVALRY 90 — Privacy-Safe Analytics Integration

- **Supported Providers:** Vercel Analytics (`NEXT_PUBLIC_VERCEL_ANALYTICS_ID`) and optional GA4 (`NEXT_PUBLIC_GA_MEASUREMENT_ID`).
- **Telemetry Sanitizer (`src/services/external/analyticsService.js`):**
  - Whitelists strictly non-sensitive context fields (`page`, `category`, `entitySlug`, `formation`, `gameMode`).
  - Strips all email addresses, user IDs, credentials, and private squad roster/tactic payloads before tracking.
- **Consent & Compliance:** External analytics trackers activate only when configured per deployment environment; unconfigured environments track zero external telemetry.

