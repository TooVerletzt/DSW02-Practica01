# Feature Specification: Autenticación por Empleado en BD

**Feature Branch**: `003-empleado-db-auth`  
**Created**: 2026-03-12  
**Status**: Draft  
**Input**: User description: "002 Autenticación por Empleado (email + password) contra base de datos, manteniendo Basic Auth como MVP."

## Clarifications

### Session 2026-03-12

- Q: ¿Se mantiene HTTP Basic Auth como mecanismo de autenticación MVP (sin JWT), usando `email` como username y validación BCrypt contra `passwordHash` en BD? → A: Sí, Basic Auth se mantiene como único mecanismo MVP.
- Q: ¿Cuál es la política final de autorización para `/api/v1/**`? → A: Requiere autenticación; `ADMIN` puede `POST/PUT/DELETE` y `USER` solo lectura (`GET`).
- Q: ¿Cuál es la política final de seed inicial de empleados? → A: Si la tabla está vacía al iniciar, crear `admin@demo.com/admin123 (ADMIN)` y `user@demo.com/user123 (USER)`, almacenando contraseñas solo como hash BCrypt.
- Q: ¿Qué compatibilidades operativas deben mantenerse en esta iteración? → A: Mantener `/api/v1`, paginación en `GET /api/v1/empleados`, Docker con dos contenedores (`postgres` + `backend`), `/actuator/health` público y Swagger/OpenAPI con `Authorize` (`basicAuth`).

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Inicio de sesión con Empleado (Priority: P1)

Como consumidor autenticado de la API, quiero iniciar sesión con mi email y password de empleado para acceder a rutas protegidas bajo `/api/v1`.

**Why this priority**: Sin autenticación real contra base de datos, el feature principal no entrega valor y no cumple el objetivo de reemplazar credenciales in-memory.

**Independent Test**: Se valida haciendo requests con Basic Auth a un endpoint de lectura en `/api/v1`, probando credenciales correctas e incorrectas contra usuarios sembrados.

**Acceptance Scenarios**:

1. **Given** que existe un empleado activo con email registrado y password válido, **When** envía una solicitud `GET` a `/api/v1/empleados` con Basic Auth `email:password`, **Then** el sistema autentica y responde con estado exitoso.
2. **Given** que el email no existe o el password no coincide, **When** envía una solicitud a `/api/v1/empleados` con Basic Auth inválido, **Then** el sistema responde `401 Unauthorized`.

---

### User Story 2 - Control de permisos por rol (Priority: P2)

Como equipo de negocio, quiero que los permisos dependan del rol del empleado para permitir solo lectura a `USER` y escritura a `ADMIN`.

**Why this priority**: Asegura la protección del CRUD y evita cambios no autorizados en datos de empleados.

**Independent Test**: Se valida ejecutando `GET`, `POST`, `PUT` y `DELETE` con un usuario `USER` y con un usuario `ADMIN`, comparando respuestas esperadas (`200/201/204`, `403`).

**Acceptance Scenarios**:

1. **Given** un empleado autenticado con rol `USER`, **When** intenta `POST`, `PUT` o `DELETE` en `/api/v1/empleados`, **Then** el sistema responde `403 Forbidden`.
2. **Given** un empleado autenticado con rol `USER`, **When** invoca `GET` en `/api/v1/empleados` o `/api/v1/empleados/{clave}`, **Then** el sistema permite la lectura.
3. **Given** un empleado autenticado con rol `ADMIN`, **When** invoca operaciones de lectura y escritura del CRUD, **Then** el sistema permite la operación según las validaciones del recurso.

---

### User Story 3 - Operación base en Docker con seed automático (Priority: P3)

Como desarrollador de la práctica, quiero levantar el sistema en Docker y disponer de usuarios iniciales para probar autenticación y roles sin carga manual.

**Why this priority**: Reduce fricción de pruebas, asegura repetibilidad local y mantiene compatibilidad operativa del entorno.

**Independent Test**: Se valida iniciando `docker compose up`, comprobando que `/actuator/health` responde `200` sin auth y verificando login con usuarios seed.

**Acceptance Scenarios**:

1. **Given** que la tabla de empleados está vacía al arranque, **When** el backend inicia, **Then** se crean exactamente los empleados seed `admin@demo.com` (ADMIN) y `user@demo.com` (USER) con password almacenado como hash BCrypt.
2. **Given** el entorno Docker levantado, **When** se consulta `/actuator/health` sin autenticación, **Then** la respuesta es `200 OK`.
3. **Given** la documentación Swagger disponible, **When** se abre la UI, **Then** está accesible y muestra botón `Authorize` para `basicAuth`.

---

### Edge Cases

- ¿Qué ocurre si dos empleados intentan registrarse con el mismo email? El segundo intento debe fallar por unicidad.
- ¿Qué ocurre si un request usa email válido pero password en claro incorrecto? Debe responder `401` sin revelar cuál credencial falló.
- ¿Qué ocurre si la tabla ya contiene empleados al iniciar? No se deben duplicar usuarios seed.
- ¿Qué ocurre si un empleado existe sin rol válido? Debe rechazarse su uso para autorización hasta corregir el dato.
- ¿Qué ocurre si se consume `/api/v1/empleados` sin parámetros de paginación? Debe mantener la paginación por defecto ya vigente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST be implemented as a Spring Boot 3 backend using Java 17.
- **FR-002**: System MUST expose business REST endpoints under `/api/v1` only (except `/swagger-ui/**`, `/v3/api-docs/**`, `/actuator/**`).
- **FR-003**: The `Empleado` entity MUST include `email` as required, unique, and limited to 100 characters.
- **FR-004**: The `Empleado` entity MUST include `passwordHash` as required and stored only as BCrypt hash.
- **FR-005**: The `Empleado` entity MUST include `role` as required with allowed values `ADMIN` or `USER`.
- **FR-006**: System MUST protect `/api/v1/**` routes with HTTP Basic Authentication using `username=email` and `password` validated against `passwordHash` BCrypt in database.
- **FR-007**: System MUST NOT use in-memory or hardcoded users as the final authentication source.
- **FR-008**: System MUST allow `GET` operations to authenticated roles `ADMIN` and `USER`.
- **FR-009**: System MUST allow `POST`, `PUT`, and `DELETE` operations only to authenticated role `ADMIN`.
- **FR-010**: Invalid or missing credentials on protected routes MUST return `401 Unauthorized`.
- **FR-011**: Forbidden role access to protected write operations MUST return `403 Forbidden`.
- **FR-012**: If employee table is empty at startup, system MUST create seed users `admin@demo.com/admin123 (ADMIN)` and `user@demo.com/user123 (USER)` storing passwords only as BCrypt hash.
- **FR-013**: If employee table is not empty at startup, system MUST NOT duplicate seed users.
- **FR-014**: System MUST persist application data in PostgreSQL.
- **FR-015**: System MUST provide Docker-based local execution with exactly two containers (`backend` + `postgres`) and working healthchecks.
- **FR-016**: System MUST keep `/actuator/health` public (`permitAll`) for healthcheck probes.
- **FR-017**: System MUST expose and maintain API documentation via Swagger/OpenAPI with `basicAuth` Authorize support.
- **FR-018**: Employee list endpoint `GET /api/v1/empleados` MUST preserve paginated behavior with `page`, `size`, `sort` and paginated metadata in response.
- **FR-019**: Authentication MVP for this feature MUST be Basic Auth; introducing `/api/v1/auth/login` is out of scope for this iteration.

### Key Entities *(include if feature involves data)*

- **Empleado**: Identidad autenticable y registro de negocio de la API, con atributos de identidad (`email`), credencial segura (`passwordHash`), autorización (`role`) y datos operativos existentes del dominio de empleados.
- **RolEmpleado**: Clasificación de autorización del empleado con valores `ADMIN` y `USER`, usada para decidir acceso de lectura/escritura.
- **CredencialSeedInicial**: Conjunto mínimo de usuarios iniciales para habilitar pruebas en ambientes nuevos sin carga manual, condicionado a tabla vacía.

## Assumptions

- El flujo MVP de autenticación será exclusivamente por HTTP Basic Auth en esta iteración.
- Los usuarios seed forman parte del entorno de práctica/desarrollo y no sustituyen la gestión normal de usuarios en escenarios productivos.
- Los endpoints funcionales existentes del CRUD de empleados y su contrato de paginación permanecen vigentes.
- Si alguna decisión entra en conflicto con el estado actual del código, se priorizarán cambios mínimos e incrementales sin rehacer arquitectura o módulos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de solicitudes con credenciales válidas de empleados registrados a rutas de lectura protegidas retorna respuesta de éxito y no `401`.
- **SC-002**: El 100% de solicitudes con credenciales inválidas a rutas protegidas retorna `401 Unauthorized`.
- **SC-003**: El 100% de intentos de `POST`, `PUT` y `DELETE` con rol `USER` retorna `403 Forbidden`, mientras que el 100% con rol `ADMIN` se procesa según reglas del recurso.
- **SC-004**: En un entorno Docker limpio con tabla vacía, los dos usuarios seed se encuentran disponibles tras el arranque y permiten autenticación en menos de 2 minutos desde `docker compose up`.
- **SC-005**: El endpoint `/actuator/health` responde `200` sin autenticación en todos los arranques válidos.
- **SC-006**: `GET /api/v1/empleados` mantiene respuesta paginada con metadatos en el 100% de ejecuciones de prueba.
