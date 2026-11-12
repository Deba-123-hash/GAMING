# RIVALRY 90 — Football Data API Integration

## Provider Comparison & Selection
Evaluated **football-data.org (v4)**, **API-Football**, and **Sportmonks**:
- **Selected Provider:** **football-data.org (v4)** (`https://www.football-data.org/documentation/quickstart`).
- **Why:** Offers a direct, predictable `X-Auth-Token` REST v4 interface with a clear registered free tier (`10 requests/min`, `12` core competitions, current-season fixtures/standings, HTTP `429` feedback) without complex proxy billing setup.
- **Limitations:** Free tier provides delayed scores/schedules, current season only, and excludes deep player-level event analytics (upgrades available via paid football-data.org plans if approved later).

## Isolation from Fictional Game Universe
- Real-world football competitions, standings, and fixtures (`externalId`, `externalTeamId`, `externalMatchId`) are kept strictly separate from `src/data/players.js`, `src/data/teams.js`, and user squads.
- Endpoints: `GET /api/football/competitions`, `GET /api/football/standings`, `GET /api/football/fixtures` plus [ExternalFootballFeed.jsx](file:///D:/GAMING/src/components/events/ExternalFootballFeed.jsx).
- When `FOOTBALL_DATA_API_KEY` is unset, endpoints return `{ configured: false, live: false, items: [] }` — never fake live scores.

