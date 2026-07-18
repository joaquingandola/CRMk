---
name: add-rest-resource
description: Add a new REST resource (entity, DTOs, mapper, repository, service, controller, exceptions) to the CRMk Spring Boot backend, following this repo's layered conventions. Use when adding a new endpoint, entity, or CRUD resource under crm/src/main/java/com/koraiken/crm/.
---

# Add a REST resource (backend)

Follow the layering in `crm/src/main/java/com/koraiken/crm/` — don't skip layers or leak entities to controllers.

## Order of implementation

1. **`model/<Entity>.java`** — `@Entity`, Lombok `@Getter/@Setter` (not `@Data`). Relations follow the `Viaje` hub pattern (see `model/Viaje.java`) if the resource relates to trips/clients.
2. **`dto/<Entity>/`** — `<Entity>CreateDTO`, `<Entity>UpdateDTO`, `<Entity>ResponseDTO`. Never expose the entity itself through the controller.
3. **`mapper/<Entity>Mapper.java`** — hand-written entity↔DTO mapping (no MapStruct in this repo).
4. **`repository/<Entity>Repository.java`** — Spring Data JPA interface.
5. **`service/<Entity>Service.java`** — business logic, validation, transitions. This is where invariants live (e.g. date-range checks like `DestinoService` does), not in the controller.
6. **`controller/<Entity>Controller.java`** — thin `@RestController` under `/api/v1/**`, delegates to the service, wraps the result in `ResponseEntity`.

## Error handling

- One exception class per failure case (e.g. `<Entity>NotFoundException`), not ad-hoc `ResponseStatusException`.
- Register it in `exception/GlobalExceptionHandler.java`: `*NotFoundException` → 404, `*YaExisteException`/`*ExisteException` → 409. Follow the existing group pattern rather than a one-off `@ExceptionHandler`.

## Authorization

- Default in `security/SecurityConfig.java` is "authenticated, any role."
- If the new endpoint should be admin-only, register it **explicitly** in the filter chain (see how `/api/v1/usuarios/**`, `/api/v1/admin/**`, `POST /api/v1/aerolineas/**` etc. are listed) — it does not inherit admin-only status from anywhere else.

## Schema

- `spring.jpa.hibernate.ddl-auto=update` — no migration tool. New/changed entity fields just need the entity annotated correctly; there's no migration file to write.

## Before calling it done

- Add/extend a test class (`*ServiceTests`) — tests run against H2 in-memory, no Postgres needed: `./mvnw test -Dtest=<Entity>ServiceTests`.
- If the resource has date ranges or overlapping-state logic, route it through the service layer the way `ViajeService`/`DestinoService` do (`DestinoFechaInvalidaException`, `DestinoFechasSolapadasException`, `ViajeSuperpuestoException`) rather than re-deriving validation in the controller.
