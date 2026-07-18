---
name: rebuild-single-service
description: Iterate on one Docker Compose service (backend, frontend, or db) in CRMk without rebuilding the whole stack. Use when a container needs a rebuild, restart, or log inspection after a code or config change.
---

# Rebuild/inspect a single service

Rebuilding the whole stack on every change is slow — target the service that actually changed.

```bash
docker compose up --build <service>      # rebuild + start just one service (backend | frontend | db)
docker compose logs -f <service>         # tail logs for one service
docker compose exec <service> sh         # shell into a running container
docker compose restart <service>         # restart without rebuilding (config/env change only, no code change)
```

## Which case applies

- Backend Java code changed → `docker compose up --build backend` (needs a Maven rebuild inside the image).
- Frontend code changed → usually no rebuild needed at all if you're using `npm run dev` locally instead; only rebuild the `frontend` container if you're specifically testing the production Docker build.
- `.env` value changed → `docker compose restart <service>` is enough, no `--build`.
- Postgres schema looks stale/wrong → check `spring.jpa.hibernate.ddl-auto=update` is actually applying; don't reach for `docker compose down -v` (drops the volume, wipes local data) unless you specifically intend to reset the database — confirm with the user first if data matters.
