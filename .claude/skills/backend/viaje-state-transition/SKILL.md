---
name: viaje-state-transition
description: Rules for touching Viaje trip-status logic — EstadoConcretoViaje, EstadoViaje history, and ViajeService.cambiarEstado. Use when a task involves trip state, status transitions, or the PATCH /api/v1/viajes/{id}/estado endpoint.
---

# Viaje state transitions

`Viaje` state is not a plain field mutation — it's a tracked history.

## The model

- `EstadoConcretoViaje` (enum) — the current state.
- `EstadoViaje` — one row per transition (`@OneToMany mappedBy = "viaje"`), i.e. an append-only history log.
- All changes go through `ViajeService.cambiarEstado`, exposed as `PATCH /api/v1/viajes/{id}/estado?nuevo=...`.

## Rules

- **Never** set `viaje.setEstado(...)` directly on the entity from a controller or another service. That bypasses the history and the transition-validity check.
- Invalid transitions must throw `ViajeTransicionInvalidaException` (already registered in `GlobalExceptionHandler` → 4xx). If you add a new transition rule, extend the validity check inside `ViajeService`, don't add a parallel check elsewhere.
- If a new feature needs "what state is this trip in," read it off `Viaje`'s current `EstadoConcretoViaje`, not by re-deriving it from the `EstadoViaje` history — the current state is the source of truth, history is for audit/display.

## When adding a new state or transition

1. Extend `EstadoConcretoViaje`.
2. Update the transition-validity logic in `ViajeService.cambiarEstado`.
3. Check any frontend code that switches on trip status (state badges, allowed-actions logic) — it will need the new case too.
4. Add a test in `ViajeServiceTests` covering both the valid path and at least one now-invalid transition into/out of the new state.
