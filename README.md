# CRMk — CRM para Agencias de Viajes

CRM pensado para agencias de viajes: centraliza clientes, viajes, destinos, acompañantes, aerolíneas y hoteles, con autenticación, roles, un dashboard con estadísticas y un mapa en vivo de clientes viajando.

Monorepo con dos apps y orquestación Docker:

- **`crm/`** — Backend en Spring Boot (Java, Maven)
- **`frontend/`** — Frontend en React + TypeScript (Vite)
- **`docker-compose.yml`** — Postgres + backend + frontend

## Funcionalidades

### Gestión de clientes y viajes
Carga de clientes con su información personal, generando un historial administrativo y comercial de la base de cada agente. Cada cliente puede tener **observaciones**: notas libres que el agente registra para no depender de la memoria en clientes recurrentes o que viajaron hace meses o años.

Cada viaje puede incluir cualquier combinación de **destinos**, elegidos sobre un catálogo de más de 60.000 ciudades del mundo, y una **aerolínea** asociada para llevar auditoría del viaje. Las fechas de los destinos se validan para evitar solapamientos dentro de un mismo viaje o entre viajes de un mismo cliente.

Los viajes tienen un estado (`COTIZADO`, `CONFIRMADO`, `PAGADO`, `CANCELADO`) con un historial completo de transiciones, y las transiciones inválidas quedan bloqueadas por el backend.

También se pueden cargar **acompañantes** de cada viaje (DNI, fecha de nacimiento y datos personales) y **hoteles** de hospedaje.

### Exportación a PDF
Cada viaje puede exportarse como un PDF con el resumen del viaje y los datos del cliente, listo para compartir o archivar.

### Dashboard y mapa interactivo
Dashboard con estadísticas en tiempo real: destinos más visitados, viajes por estado, ingresos por mes durante el último año, y más. Incluye además un **mapa interactivo** que muestra en vivo dónde se encuentra cada cliente que está actualmente de viaje.

### Usuarios y roles
Autenticación vía JWT, con dos roles: `AGENTE` y `ADMIN`. Los administradores pueden gestionar usuarios (listar, editar, desactivar/reactivar), dar de baja clientes y administrar aerolíneas, además de acceder a funciones exclusivas de administración.

### Importación masiva de ciudades
Los administradores pueden importar el catálogo de ciudades desde un archivo CSV (`worldcities.csv`), para poblar o actualizar el catálogo de destinos disponible en toda la app.

## Stack técnico

**Backend:** Spring Boot 4, Spring Security (JWT), Spring Data JPA, PostgreSQL (H2 para tests), OpenPDF, Apache Commons CSV.

**Frontend:** React 19, TypeScript, Vite, React Router, Axios, Tailwind CSS, React Leaflet (mapa).

## Cómo correr el proyecto

### Con Docker (recomendado)
```bash
docker compose up --build
```
Ver [DOCKER.md](./DOCKER.md) para setup completo, variables de entorno y troubleshooting.

### En local

**Backend** (`crm/`):
```bash
./mvnw spring-boot:run   # API en http://localhost:8080
./mvnw test              # correr tests (usa H2, no requiere Postgres)
```

**Frontend** (`frontend/`):
```bash
npm run dev       # http://localhost:5173
npm run build
npm run lint
```
