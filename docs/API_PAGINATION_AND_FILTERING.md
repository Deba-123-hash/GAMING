# RIVALRY 90 — API Pagination & Filtering

- **Utility:** `parsePaginationParams()` and `buildPaginationMeta()` in [pagination.js](file:///D:/GAMING/src/lib/api/pagination.js) enforce `DEFAULT_PAGE = 1`, `DEFAULT_LIMIT = 20`, and `MAX_LIMIT = 50`.
- **Supported Query Parameters:**
  - `page`, `limit` / `pageSize`
  - `sortBy` / `sort`, `order`
  - Domain filters: `position`, `teamId`, `nationality`, `minOvr`, `maxOvr`, `type` (`Club` / `National Team`), `category`, `status`, `mediaType`, `search` / `q`
- **Metadata Shape:** `{ page, limit, total, totalPages }` returned cleanly inside `meta` on paginated endpoints such as `/api/players/search`.

