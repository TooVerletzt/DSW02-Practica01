# Feature Specification: CRUD Departamentos y Empleados

**Feature Branch**: `001-departamentos-empleados-crud`  
**Created**: 2026-03-12  
**Status**: Draft  
**Input**: User description: "CRUD de Departamentos unido con Empleados."

## Clarifications

### Session 2026-03-12

- Q: La relacion `Empleado -> Departamento` debe ser obligatoria u opcional? -> A: Es opcional (`nullable`).
- Q: Como se envia la asignacion de departamento en create/update de empleado y que ocurre si la clave no existe? -> A: Se envia en `departamentoClave`; si no existe, responde `400 Bad Request` con JSON estandar (`timestamp`, `status`, `error`, `message`, `path`).
- Q: Cual es la regla final de `DELETE /api/v1/departamentos/{clave}`? -> A: Si tiene empleados asignados responde `409 Conflict` y no borra; si no tiene empleados responde `204`.
- Q: Cual es la politica de seguridad para este feature? -> A: Se mantiene la actual: `/api/v1/**` con Basic Auth contra BD, `GET` para `USER` y `ADMIN`, `POST/PUT/DELETE` solo `ADMIN`, `/actuator/health` publico (`permitAll`) y Swagger con `Authorize`.
- Q: Cuales son las reglas finales de paginacion/validacion para `GET /api/v1/departamentos`? -> A: `page < 0` => `400`; `size < 1` o `size > 100` => `400`; `sort` invalido => `400`; respuesta paginada incluye `content`, `totalElements`, `totalPages`, `number`, `size`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Gestionar Departamentos (Priority: P1)

Como usuario autenticado, quiero administrar departamentos mediante API versionada para registrar, consultar, actualizar y eliminar departamentos.

**Why this priority**: Sin CRUD de departamentos no existe el nuevo recurso solicitado ni base para asociarlo con empleados.

**Independent Test**: Se valida ejecutando CRUD completo sobre `/api/v1/departamentos` con respuestas esperadas y paginacion funcional.

**Acceptance Scenarios**:

1. **Given** un `ADMIN` autenticado, **When** crea un departamento con `clave` y `nombre` validos, **Then** el sistema responde `201` con el registro creado.
2. **Given** un usuario autenticado (`USER` o `ADMIN`), **When** consulta `GET /api/v1/departamentos` con parametros validos, **Then** recibe `200` con `content`, `totalElements`, `totalPages`, `number`, `size`.
3. **Given** un `ADMIN` autenticado y un departamento existente, **When** actualiza el recurso, **Then** recibe `200` con datos actualizados.

---

### User Story 2 - Asociar Empleado a Departamento (Priority: P2)

Como `ADMIN`, quiero asignar opcionalmente un departamento a un empleado usando `departamentoClave` en altas y ediciones para mantener relacion entre recursos.

**Why this priority**: Aporta la integracion funcional entre empleados y departamentos sin romper el CRUD actual de empleados.

**Independent Test**: Se valida creando y actualizando empleados con y sin `departamentoClave`, incluyendo rechazo de claves inexistentes.

**Acceptance Scenarios**:

1. **Given** un `ADMIN` autenticado y un departamento existente, **When** crea o actualiza un empleado con `departamentoClave` valido, **Then** la operacion es exitosa y la relacion queda persistida.
2. **Given** un `ADMIN` autenticado, **When** envia `departamentoClave` inexistente en create/update de empleado, **Then** el sistema responde `400` con JSON estandar de error (`timestamp,status,error,message,path`).
3. **Given** un `ADMIN` autenticado, **When** envia empleado sin `departamentoClave`, **Then** la operacion se procesa exitosamente con relacion nula.

---

### User Story 3 - Borrado con Integridad y Seguridad Consistente (Priority: P3)

Como responsable de calidad, quiero reglas de borrado de departamentos con integridad referencial y sin regresion de seguridad.

**Why this priority**: Evita eliminar departamentos en uso y preserva las reglas de acceso ya establecidas para `/api/v1/**`.

**Independent Test**: Se valida borrado con y sin empleados asignados, y controles de rol para lectura/escritura.

**Acceptance Scenarios**:

1. **Given** un `ADMIN` autenticado y un departamento con empleados asignados, **When** intenta `DELETE /api/v1/departamentos/{clave}`, **Then** el sistema responde `409 Conflict` con JSON estandar de error.
2. **Given** un `ADMIN` autenticado y un departamento sin empleados asignados, **When** ejecuta `DELETE /api/v1/departamentos/{clave}`, **Then** el sistema responde `204 No Content`.
3. **Given** un `USER` autenticado, **When** intenta `POST`, `PUT` o `DELETE` en `/api/v1/departamentos`, **Then** el sistema responde `403 Forbidden`.

### Edge Cases

- `GET /api/v1/departamentos` con `page < 0` debe responder `400`.
- `GET /api/v1/departamentos` con `size < 1` o `size > 100` debe responder `400`.
- `GET /api/v1/departamentos` con `sort` invalido debe responder `400`.
- `POST` o `PUT` de departamento con `clave` mayor a 16 o `nombre` mayor a 100 debe responder `400`.
- `POST` de departamento con `clave` duplicada debe responder error de validacion.
- `GET /api/v1/departamentos/{clave}` para clave inexistente debe responder `404`.
- `DELETE` de departamento inexistente debe responder `404`.
- Si un empleado asociado se actualiza con `departamentoClave` nulo, la relacion debe removerse sin error.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose and maintain this feature as part of the existing backend API service.
- **FR-002**: System MUST expose business REST endpoints under `/api/v1` only (except `/swagger-ui/**`, `/v3/api-docs/**`, `/actuator/**`).
- **FR-003**: System MUST provide a `Departamento` resource with fields `clave` (required string, max 16, primary identifier) and `nombre` (required string, max 100).
- **FR-004**: System MUST expose `/api/v1/departamentos` endpoints for list (paginado), detail by `clave`, create, update, and delete.
- **FR-005**: `GET /api/v1/departamentos` MUST support `page`, `size`, and `sort` and return `content`, `totalElements`, `totalPages`, `number`, `size`.
- **FR-006**: For department list, `page < 0` MUST return `400`.
- **FR-007**: For department list, `size < 1` or `size > 100` MUST return `400`.
- **FR-008**: For department list, invalid `sort` format or unsupported field/direction MUST return `400`.
- **FR-009**: System MUST keep authentication source in persisted `Empleado` records (email + hashed password) and MUST NOT reintroduce in-memory users.
- **FR-010**: All `/api/v1/**` endpoints MUST require HTTP Basic authentication; `GET` MUST allow `USER` and `ADMIN`; `POST`, `PUT`, `DELETE` MUST allow only `ADMIN`.
- **FR-011**: `/actuator/health` MUST remain public (`permitAll`) and Swagger/OpenAPI MUST remain accessible with `Authorize` via `basicAuth`.
- **FR-012**: `Empleado` MUST include an optional reference to `Departamento` (nullable relationship).
- **FR-013**: Employee create/update payloads MUST support optional `departamentoClave`.
- **FR-014**: If provided `departamentoClave` does not exist, employee create/update MUST return `400 Bad Request` with standard error JSON fields: `timestamp`, `status`, `error`, `message`, `path`.
- **FR-015**: Deleting a department with assigned employees MUST be blocked with `409 Conflict` and standard error JSON fields.
- **FR-016**: Deleting a department without assigned employees MUST return `204 No Content`.
- **FR-017**: Data model changes for departments and employee-department relationship MUST be versioned through controlled schema migrations.
- **FR-018**: Local execution with Docker (`backend` + `postgres`) and healthchecks MUST remain functional after introducing departments.

### Key Entities *(include if feature involves data)*

- **Departamento**: Unidad organizacional con `clave` unica (max 16) y `nombre` (max 100), administrable via CRUD bajo `/api/v1/departamentos`.
- **Empleado**: Recurso existente que ahora puede referenciar opcionalmente un `Departamento` mediante `departamentoClave`.
- **AsignacionEmpleadoDepartamento**: Relacion opcional entre empleado y departamento, utilizada para validaciones de asignacion y reglas de borrado.

## Assumptions

- La autenticacion y autorizacion actual de empleados ya esta operativa y se conserva para este feature.
- El formato de error JSON estandar actual (`timestamp,status,error,message,path`) sigue siendo el contrato oficial para errores de negocio y validacion.
- La compatibilidad de rutas existentes de empleados no se modifica fuera de agregar el soporte opcional de `departamentoClave`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de operaciones CRUD de departamentos con datos validos y rol `ADMIN` retorna codigos esperados (`201`, `200`, `204`).
- **SC-002**: El 100% de consultas paginadas de departamentos retorna estructura con `content`, `totalElements`, `totalPages`, `number`, `size`.
- **SC-003**: El 100% de solicitudes con `departamentoClave` inexistente en create/update de empleado retorna `400` con estructura de error estandar.
- **SC-004**: El 100% de intentos de borrado de departamentos con empleados asociados retorna `409`, y el 100% de borrados sin asociaciones retorna `204`.
- **SC-005**: El 100% de accesos `GET` a `/api/v1/departamentos` con `USER` y `ADMIN` autenticados es exitoso, mientras que el 100% de escrituras con `USER` retorna `403`.
- **SC-006**: Tras aplicar migraciones, el entorno Docker de dos contenedores (`postgres` + `backend`) inicia saludable en todos los arranques de validacion del feature.
