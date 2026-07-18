---
name: add-resource-pages
description: Scaffold the standard page set (list/detail/create/edit) plus API client and routing for a new resource in the CRMk React frontend. Use when adding a new resource's screens under frontend/src/pages/.
---

# Add resource pages (frontend)

Follow the existing per-resource split in `frontend/src/pages/<resource>/` (see `viajes/`, `clientes/` for reference).

## Files to create

1. **`api/<resource>.ts`** — one file per resource, wraps calls through the shared `api/axios.ts` instance. Don't call `axios` directly from a page — always go through this file.
2. **`pages/<resource>/<Resource>Page.tsx`** — list view.
3. **`pages/<resource>/<Resource>Detalle.tsx`** — detail view.
4. **`pages/<resource>/<Resource>Nuevo.tsx`** — create form.
5. **`pages/<resource>/<Resource>Editar.tsx`** — edit form.

Keep this naming exactly — other resources follow it and it's what makes the pages folder navigable.

## Routing

Add routes in `App.tsx`. Everything except `/login` sits nested under `PrivateRoute` → `Layout` — don't add a route outside that nesting unless it's genuinely public.

## Auth

`api/axios.ts` already attaches the JWT from `localStorage` and force-redirects to `/login` on 401. Don't add per-page 401 handling — it's centralized there.

## Entity pickers

If the form needs to select an existing entity (city, hotel, client, airline) rather than free-text input, use or extend a `components/Buscadores/` picker — see the `buscador-picker` skill.

## Before calling it done

Start the dev server (`npm run dev`) and actually exercise the new pages in a browser — create, view, edit — per this repo's rule that UI changes must be manually verified, not just type-checked. See the `verify-ui-change` skill.
