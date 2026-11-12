# RIVALRY 90 — Frontend API Integration Guide

- **Client Wrapper & Endpoints:** [apiClient.js](file:///D:/GAMING/src/lib/api/apiClient.js) (`apiRequest`, 10s `AbortController` timeout, `same-origin` credentials) + [endpoints.js](file:///D:/GAMING/src/lib/api/endpoints.js) (`API_ENDPOINTS`).
- **Provider-Safe React Query Hooks:** [hooks.js](file:///D:/GAMING/src/lib/api/hooks.js) exports `useInternalQuery`, `usePlayersQuery`, `useTeamsQuery`, `useGameModesQuery`, `useFormationsQuery`, and `useSquadsQuery`, syncing cache with `QueryClientContext` when mounted inside `QueryProvider`.
- **Connected Modules:** `PlayerShowcase`, `TeamsSection`, `GameModesSection`, `PlayerFilters`, `TeamsCatalog`, `SquadBuilder` (load saved squads, `PATCH` update, `POST` create, `refetch`), `/events/[slug]`, `/profile/*`, `/my-squad`, and `/admin/*`.

