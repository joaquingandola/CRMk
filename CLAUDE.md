# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

CRM for travel agencies (CRMk). Manages clients (`Cliente`), their trips (`Viaje`), trip destinations (`Destino`, sourced from a catalog of 60,000+ world cities/`Ciudad`), travel companions (`Acompanante`), airlines (`Aerolinea`), hotels, and per-client notes (`Observacion`). Includes a dashboard with stats (top destinations, trips by status, monthly revenue) and a live map of clients currently traveling.

Monorepo with two apps plus Docker orchestration:
- `crm/` — Spring Boot backend (Java, Maven)
- `frontend/` — React + TypeScript frontend (Vite)
- `docker-compose.yml` — Postgres + backend + frontend, at the repo root

## Commands

### Backend (`crm/`)
```bash
./mvnw spring-boot:run          # run the API locally (port 8080)
./mvnw test                     # run all tests
./mvnw test -Dtest=ViajeServiceTests            # run a single test class
./mvnw test -Dtest=ViajeServiceTests#someMethod # run a single test method
./mvnw package                  # build the jar
```
Tests use H2 in-memory DB (test scope dependency); no external Postgres needed to run them.

### Frontend (`frontend/`)
```bash
npm run dev       # Vite dev server (port 5173, host: true, polling watch for containers)
npm run build     # tsc -b && vite build
npm run lint      # eslint .
npm run preview   # preview production build
```

### Full stack via Docker
```bash
docker compose up --build
```
Reads `.env` at repo root for `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DDL_AUTO`, `JWT_SECRET_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (see `.env.example`). Backend on 8080, frontend on 80, Postgres exposed on host port 5433. The frontend nginx container reverse-proxies `/api/**` and `/auth/**` to the backend over the compose network, so the browser only ever talks to the frontend's origin — no CORS involved in this path.

## Backend architecture (`crm/src/main/java/com/koraiken/crm/`)

Layered Spring Boot app, one package per concern, organized flat (not per-feature):
- `controller/` — `@RestController`s under `/api/v1/**` (auth under `/auth/**`). Thin: delegate straight to a service and wrap the result in `ResponseEntity`.
- `service/` — business logic, transitions, validation.
- `repository/` — Spring Data JPA repositories.
- `model/` — JPA entities (`@Entity`), one file per entity, using Lombok `@Getter/@Setter` rather than `@Data`.
- `dto/<Entity>/` — DTOs grouped by entity into subpackages (e.g. `dto/Viaje/ViajeCreateDTO`, `ViajeUpdateDTO`, `ViajeResponseDTO`). Controllers/services never expose entities directly.
- `mapper/` — hand-written entity↔DTO mappers (no MapStruct).
- `exception/` — one exception class per failure case (e.g. `ClienteNotFoundException`, `ViajeTransicionInvalidaException`), all funneled through `exception/GlobalExceptionHandler.java` which maps exception groups to HTTP status codes (404 for `*NotFoundException`, 409 for `*YaExisteException`/`ClienteExisteException`, etc.) and returns a uniform `ErrorResponseDTO`. Add new domain errors as a new exception class registered in the handler, not as ad-hoc `ResponseStatusException`s.
- `security/` — stateless JWT auth: `JWTAuthFilter` (per-request filter), `JWTService` (token issue/parse), `SecurityConfig` (route authorization rules, CORS, `BCryptPasswordEncoder`).

Key domain model (`model/Viaje.java` is the hub):
- `Viaje` belongs to one `Cliente`, optionally an `Aerolinea`, has many `Destino` (one-to-many) and many `Acompanante` (many-to-many via `viajeAcompanante` join table).
- `Viaje` state is tracked via `EstadoConcretoViaje` (enum) with a history in `EstadoViaje` (one row per transition, `OneToMany mappedBy = "viaje"`). State changes go through `ViajeService.cambiarEstado` (`PATCH /api/v1/viajes/{id}/estado?nuevo=...`) and invalid transitions throw `ViajeTransicionInvalidaException` — don't mutate state directly on the entity.
- Destino date-range validation lives in `ViajeService`/`DestinoService` and throws `DestinoFechaInvalidaException` / `DestinoFechasSolapadasException` / `ViajeSuperpuestoException` — trip and destination dates must stay internally consistent, so route new date logic through there rather than re-deriving it in a controller.

Authorization (`security/SecurityConfig.java`): everything under `/auth/**` is public; `/api/v1/usuarios/me` just needs auth; `/api/v1/usuarios/**`, `/api/v1/admin/**`, `POST /api/v1/aerolineas/**`, `POST /api/v1/destinos/ciudades`, and `PATCH /api/v1/clientes/*/baja` require `ROLE_ADMIN` (`TipoRol.ADMIN`); everything else just requires a valid JWT. When adding an endpoint that should be admin-only, register it explicitly in this filter chain — the default is "authenticated, any role".

Config in `src/main/resources/application.properties` pulls secrets from env vars (`JWT_SECRET_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`); `spring.jpa.hibernate.ddl-auto=update` — schema evolves via entity changes, no migration tool in use.

## Frontend architecture (`frontend/src/`)

- `api/` — one file per resource (`clientes.ts`, `viajes.ts`, `acompanantes.ts`, etc.), each wrapping calls through the shared `api/axios.ts` instance. That instance attaches the JWT from `localStorage` on every request and force-redirects to `/login` on a 401 (except from the login call itself) — auth failures are handled centrally here, not per-page.
- `context/AuthContext.tsx` + `hooks/useAuth.ts` — auth state/session.
- `components/ui/PrivateRoute.tsx` — route guard; `Layout.tsx` — authenticated shell (with `Sidebar.tsx`).
- `components/Buscadores/` — async search/autocomplete pickers (e.g. `BuscadorCiudad`, `BuscadorHotel`) used inside forms for entity selection against the large city catalog.
- `pages/<resource>/` — one folder per resource, generally with `<Resource>Page` (list), `<Resource>Detalle` (detail), `<Resource>Nuevo` (create), `<Resource>Editar` (edit) — follow this naming/file split when adding a new resource's screens.
- Routing in `App.tsx`: everything except `/login` is nested under `PrivateRoute` → `Layout`.
- Dashboard (`pages/dashboard/Dashboard.tsx`) and live map (`pages/dashboard/DashboardMap.tsx`, via `react-leaflet`) are separate pages/routes, backed by `api/dashboard.ts`.
- `VITE_API_BASE_URL` env var points the frontend at the backend. Defaults to `http://localhost:8080` in local `npm run dev` (via `frontend/.env.development`, since the backend runs separately on 8080 there); in the Docker build it's unset and `frontend/src/api/axios.ts` falls back to `window.location.origin`, so the Dockerized frontend calls its own nginx origin, which reverse-proxies to the backend.
