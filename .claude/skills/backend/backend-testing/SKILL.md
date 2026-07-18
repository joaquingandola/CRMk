---
name: backend-testing
description: How to run and write backend tests for CRMk (Spring Boot, H2 in-memory DB, Maven). Use when writing, running, or debugging a *ServiceTests class or deciding whether backend changes need test coverage.
---

# Backend testing

Tests use H2 in-memory DB (test-scope dependency) — no Postgres/Docker needed to run them.

## Running

```bash
./mvnw test                                       # full suite
./mvnw test -Dtest=ViajeServiceTests               # one class
./mvnw test -Dtest=ViajeServiceTests#someMethod    # one method
```

## What to cover

- Service-layer tests, not controller-layer — business logic (validation, transitions, date-overlap checks) lives in `service/`, so that's where the coverage should target.
- For anything touching `ViajeService`/`DestinoService` date logic: cover both a valid case and the exception case (`DestinoFechaInvalidaException`, `DestinoFechasSolapadasException`, `ViajeSuperpuestoException`).
- For state transitions: cover a valid `cambiarEstado` call and at least one call that should throw `ViajeTransicionInvalidaException`.
- New exception classes should have a test asserting `GlobalExceptionHandler` maps them to the right status code, if that mapping isn't already covered by an existing test in the same status-code group.

## Before considering a backend task done

Run the relevant test class (not just the file that changed) plus `./mvnw test` for the full suite if the change touches shared logic (e.g. `ViajeService`, mappers, `GlobalExceptionHandler`).
