# Running CRMk with Docker

## Prerequisites

- Docker with the Compose plugin (`docker compose version`)

## First-time setup

```bash
cp .env.example .env
```

Edit `.env` and fill in real values — at minimum set a real `DB_PASSWORD`, a real `JWT_SECRET_KEY` (any random string; it signs the app's JWTs), and `ADMIN_EMAIL`/`ADMIN_PASSWORD` (the admin user seeded on first backend startup).

## Running the stack

```bash
docker compose up --build
```

First run builds all three images (Postgres is pulled, the backend and frontend are built from source) and starts them in dependency order: `db` → `backend` → `frontend`. Subsequent runs only rebuild what changed.

To stop:

```bash
docker compose down          # stop containers, keep the Postgres data volume
docker compose down -v       # also delete the Postgres data volume (full reset)
```

## Services and ports

| Service    | Container port | Host port | What it is |
|------------|-----------------|-----------|------------|
| `db`       | 5432            | 5433      | Postgres 17 |
| `backend`  | 8080            | 8080      | Spring Boot API |
| `frontend` | 80              | 80        | nginx serving the built React app |

Open **http://localhost** in a browser — that's the app.

## How the frontend talks to the backend

The frontend is built into a static bundle and served by nginx. In the browser, all API calls (`/api/v1/**`) and auth calls (`/auth/**`) go to the *same origin* (`http://localhost`, port 80) — nginx reverse-proxies those paths to the `backend` container over Docker's internal network (see `frontend/nginx.conf`). This means:

- There's no CORS involved in the Dockerized flow — the browser never makes a cross-origin request.
- The stack works the same way regardless of what host/domain it's deployed on (not hardcoded to `localhost`).

This is different from local frontend development (`cd frontend && npm run dev`), where Vite serves the app directly on `:5173` and the frontend calls the backend directly on `:8080` (configured via `frontend/.env.development`). That flow requires a separately-running backend (`./mvnw spring-boot:run` in `crm/`) and relies on the CORS config in `SecurityConfig.java`, which allows `http://localhost:5173`.

## Troubleshooting

**Backend container keeps restarting / exits immediately**
Check logs: `docker compose logs backend`. The most common cause is a missing/misnamed env var — confirm `.env` at the repo root defines `JWT_SECRET_KEY` (not `JWT_SECRET`), since `docker-compose.yml` reads that exact name.

**Backend "unhealthy", frontend never starts**
The `frontend` service waits for the backend's healthcheck (`/actuator/health`) to pass before starting. Check `docker compose ps` for the backend's health status, and `docker compose logs backend` for startup errors — usually a database connection issue (confirm `db` is healthy first) or the JWT env var issue above.

**Frontend loads but login/API calls fail**
Open browser devtools → Network tab. Requests should go to `http://localhost/auth/...` and `http://localhost/api/v1/...` (same origin, port 80) — if they're going anywhere else, the frontend image may have been built with a stale `VITE_API_BASE_URL` baked in; rebuild with `docker compose up --build`.

**Database changes don't seem to reset**
`docker compose down` alone keeps the named `postgres_data` volume. Use `docker compose down -v` to drop it and start from a clean schema (re-applied via `spring.jpa.hibernate.ddl-auto=update` / `DDL_AUTO` on next backend startup).
