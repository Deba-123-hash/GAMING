# RIVALRY 90 — API Validation Guide

- **Library:** Zod (`^4.6.7`) shared across [authValidation.js](file:///D:/GAMING/src/server/auth/authValidation.js), [domainSchemas.js](file:///D:/GAMING/src/server/validation/domainSchemas.js), [validators.js](file:///D:/GAMING/src/utils/validators.js), and route-level schemas (`squads/[squadId]/players`, `ai/*`, `admin/integrations`).
- **Helpers:** `parseJsonBody(request)` rejects malformed JSON (`400`), and `validateWithSchema(schema, payload)` flattens field-level validation issues cleanly (`400 VALIDATION_ERROR`).
- **Enforced Checks:** Username regex, password strength policy (`>= 8 chars`, upper/lower/digit), 1–99 stat ranges, hex color patterns, ISO dates (`endAt >= startAt`), relative/http(s) URL constraints, formation enums, 11 starting slot bounds, and 7 substitute caps.

