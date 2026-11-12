# RIVALRY 90 — Database Integrity Audit (Phase 20)

## Implemented Non-Destructive Audits
1. **Runtime Store Auditor (`src/server/database/integrityAudit.js` -> `runDatabaseIntegrityAudit()`):**
   - Verifies unique non-empty usernames and valid account statuses (`active`, `suspended`, `banned`).
   - Detects orphan `user_profiles`, orphan `squads`, and orphan `players.teamId`.
   - Verifies player shirt-number uniqueness per team and OVR bounds (`1..99`).
   - Validates every squad obeys `<= 11` starters, `<= 7` substitutes, zero duplicate player assignments, valid `FORMATIONS_CONFIG` code, and active-roster captain membership.
   - Verifies unique slugs across players, events, news articles, and `endAt >= startAt` date ordering.
2. **CLI Check (`npm.cmd run db:integrity`):** Runs `scripts/check-db-integrity.mjs` cleanly in CI/local environments without mutating any data.
3. **Current Result:** Observed `0` anomalies across all universe fixtures (`32` players, `10` teams, `10` formations, `6` events, `10` articles).

