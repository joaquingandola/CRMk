---
name: local-stack
description: Run and configure the full CRMk stack (Postgres + backend + frontend) via Docker Compose. Use when starting the full stack locally, or debugging .env / port / service wiring issues.
---

# Local stack via Docker Compose

```bash
docker compose up --build
```

Orchestration file is `docker-compose.yml` at the repo root.

## Required `.env` (repo root)

| Var | Purpose |
|---|---|
| `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Postgres |
| `JWT_SECRET` | backend JWT signing |
| `CLOUDINARY_*` | image storage |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | seeded admin user |

If the stack fails to start or the backend can't authenticate, check `.env` exists and has all of the above before debugging code — a missing var is the most common cause.

## Ports

- Backend: `8080`
- Frontend: `80`
- Postgres: exposed on host `5433` (not the default 5432 — avoids clashing with a local Postgres install)

## Local dev without Docker

Running `./mvnw spring-boot:run` (backend, port 8080) and `npm run dev` (frontend, port 5173) directly is faster for iteration than rebuilding containers each time — reach for Docker Compose specifically when you need Postgres (not H2) or need to verify the full containerized stack, not for routine day-to-day coding.
