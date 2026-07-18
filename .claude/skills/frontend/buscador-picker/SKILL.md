---
name: buscador-picker
description: Pattern for async search/autocomplete entity pickers (BuscadorCiudad, BuscadorHotel, etc.) used inside CRMk forms. Use when a form needs to select an existing entity — especially against the 60,000+ row Ciudad catalog — instead of free-text input.
---

# Buscador picker pattern

Location: `frontend/src/components/Buscadores/`.

## Why it exists

The `Ciudad` catalog has 60,000+ rows — a plain `<select>` or client-side filter doesn't scale. Buscadores debounce input and query the backend for matches server-side, then let the user pick from a short result list.

## When to use one

Any form field that references an existing entity by ID (city for a `Destino`, hotel, airline, client for a companion, etc.) rather than accepting raw text. Look at `BuscadorCiudad` or `BuscadorHotel` as the reference implementation before writing a new one.

## When to add a new Buscador vs. reuse

- Reuse an existing Buscador if the entity is already covered (city, hotel are the common ones).
- Add a new one only if the target entity doesn't have one yet and genuinely needs search-as-you-type (large or growing catalog). For small fixed lists (e.g. a handful of statuses), a plain `<select>` is simpler — don't build a Buscador for it.

## Wiring into a form

The picker should call through the resource's `api/<resource>.ts` file, not a raw fetch — same rule as everywhere else in this frontend.
