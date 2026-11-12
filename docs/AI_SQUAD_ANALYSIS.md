# RIVALRY 90 — AI Squad Analysis

## Endpoint (`POST /api/ai/squad-analysis`)
1. Authenticates caller (`assertAuthenticated`) and enforces per-user rate limiting (`15 req/min`).
2. When `squadId` is provided, calls `getOwnedSquad(squadId, user.id)` (`403` on non-owner) and hydrates canonical player stats.
3. Computes OVR, line ratings, and positional compatibility via `calculateSquadRatings()`.
4. Calls Gemini API if `GEMINI_API_KEY` is configured (or deterministic heuristic fallback otherwise).
5. Returns structured advisory output (`overallSummary`, `strengths`, `weaknesses`, `formationAnalysis`, `defensiveAnalysis`, `attackingAnalysis`, `suggestions`, `limitations`) inside [SquadBuilder.jsx](file:///D:/GAMING/src/components/squad/SquadBuilder.jsx).
6. **Non-Mutating Guarantee:** AI never edits or overwrites a saved squad automatically.

