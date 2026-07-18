---
name: feature-plan
description: How to break a full-stack CRMk feature (spans backend + frontend) into an implementation plan before writing code. Use when a task touches both crm/ and frontend/, or is non-trivial enough to warrant Plan mode.
---

# Planning a full-stack feature

Most CRMk features cross both apps. Plan both sides before writing code so the DTO shape, endpoint contract, and page structure are decided once, not renegotiated mid-implementation.

## Shape of the plan

1. **Domain model** — new entity? new relation on an existing one (`Viaje`, `Cliente`, `Destino`, etc.)? Does it need date-range or state-transition logic, i.e. does it touch the patterns in the `backend/viaje-state-transition` skill?
2. **Backend contract** — DTOs (`Create`/`Update`/`Response`), the endpoint shape (`/api/v1/...`), and whether it's admin-only (register in `SecurityConfig` explicitly — see the `backend/add-rest-resource` skill).
3. **Frontend surface** — which of `<Resource>Page` / `Detalle` / `Nuevo` / `Editar` are actually needed (not every feature needs all four), and what `api/<resource>.ts` functions the pages call.
4. **Edge cases up front** — overlapping dates, invalid state transitions, admin vs regular user, empty/large datasets. Deciding these during planning avoids rework compared to discovering them mid-implementation.
5. **Test plan** — which service-layer tests, and what to manually verify in the browser (see the `frontend/verify-ui-change` skill).

## When to actually use Plan mode

Use it when the feature spans multiple files across both apps or has a non-obvious design decision (new state, new relation, schema shape). Skip it for a single-file bug fix or a change confined to one layer — planning overhead there is pure friction.
