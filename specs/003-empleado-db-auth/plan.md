# Implementation Plan: Empleado DB Auth (Basic Auth MVP)

**Branch**: `003-empleado-db-auth` | **Date**: 2026-03-12 | **Spec**: `/specs/003-empleado-db-auth/spec.md`
**Input**: Feature specification from `/specs/003-empleado-db-auth/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Migrar autenticación de usuarios in-memory a autenticación contra tabla
`empleados` utilizando `email` como username de HTTP Basic Auth y validación
BCrypt contra `password_hash`, manteniendo cambios mínimos e incrementales.

Se preservan sin regresión:
- rutas versionadas bajo `/api/v1`
- paginación en `GET /api/v1/empleados`
- docker compose de 2 contenedores (`postgres` + `backend`) con healthchecks
- `/actuator/health` público (`permitAll`)
- Swagger/OpenAPI accesible con `basicAuth` (`Authorize`)

Precondición de implementación para esta práctica:
- BD limpia; no se implementa backfill automático de datos legacy.
- Si existen datos incompatibles, ejecutar `docker compose down -v` antes de levantar el entorno.

## Technical Context

**Language/Version**: Java 17  
**Primary Dependencies**: Spring Boot 3.3.x (Web, Data JPA, Security, Validation, Actuator), Spring Data Pageable, Flyway, springdoc-openapi  
**Storage**: PostgreSQL (tabla `empleados`)  
**Testing**: Validación manual con `curl` y smoke tests operativos con Docker Compose  
**Target Platform**: Linux + Docker local runtime  
**Project Type**: Backend web service (REST API)  
**Performance Goals**: Sin meta nueva; mantener latencia equivalente y evitar degradación por autenticación BD  
**Constraints**: Cambios mínimos sin reestructurar arquitectura/módulos; sin JWT; mantener contratos/rutas existentes salvo ajustes estrictamente necesarios  
**Scale/Scope**: Un solo servicio backend de empleados con autenticación básica basada en BD

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Stack gate: PASS (Spring Boot 3 + Java 17 ya en uso).
- API versioning gate: PASS (`/api/v1/**` ya vigente para endpoints de negocio).
- Security gate: PASS (diseño propuesto: Basic Auth + identidad desde `Empleado` persistido con BCrypt).
- Identity source gate: PASS (se elimina `InMemoryUserDetailsManager` como fuente final).
- Authorization gate: PASS (GET para `ADMIN/USER`; POST/PUT/DELETE solo `ADMIN`).
- Data gate: PASS (PostgreSQL + Flyway existentes).
- Runtime gate: PASS (2 contenedores y `/actuator/health` público mantenido).
- Documentation gate: PASS (OpenAPI con `basicAuth` ya activo; se mantiene).
- Pagination gate: PASS (listado paginado existente se preserva).

Pre-Phase 0 status: PASS.

## Project Structure

### Documentation (this feature)

```text
specs/003-empleado-db-auth/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/main/java/com/dsw02/empleados/
│   ├── config/
│   ├── controller/
│   ├── model/
│   ├── repository/
│   └── service/
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/
└── pom.xml

docker-compose.yml
```

**Structure Decision**: Mantener estructura backend actual y aplicar cambios
quirúrgicos en entidad/repositorio/seguridad/seed sin crear nuevos módulos.

## Planned File Touch List (Implementation)

### Create
- `backend/src/main/resources/db/migration/V2__add_auth_fields_to_empleados.sql`
- `backend/src/main/java/com/dsw02/empleados/config/EmpleadoSeedInitializer.java`

### Modify
- `backend/src/main/java/com/dsw02/empleados/model/Empleado.java`
- `backend/src/main/java/com/dsw02/empleados/repository/EmpleadoRepository.java`
- `backend/src/main/java/com/dsw02/empleados/config/SecurityConfig.java`
- `backend/src/main/java/com/dsw02/empleados/model/EmpleadoCreateRequest.java`
- `backend/src/main/java/com/dsw02/empleados/model/EmpleadoUpdateRequest.java`
- `backend/src/main/java/com/dsw02/empleados/model/EmpleadoResponse.java`
- `backend/src/main/java/com/dsw02/empleados/service/EmpleadoService.java`
- `backend/src/main/java/com/dsw02/empleados/config/OpenApiConfig.java` (solo si requiere ajuste descriptivo)
- `specs/003-empleado-db-auth/contracts/openapi.yaml`
- `specs/003-empleado-db-auth/quickstart.md`

## Implementation Order

1. **Migración BD (Flyway)**
  - agregar columnas `email`, `password_hash`, `role` a `empleados`
  - crear índice único para `email`
  - sin backfill automático; asumir BD limpia en esta práctica
2. **Repositorio y modelo**
  - extender `Empleado` y `EmpleadoRepository` para búsqueda por `email`
3. **Seguridad**
  - reemplazar `InMemoryUserDetailsManager` por `UserDetailsService` respaldado por BD
  - mantener Basic Auth, rutas públicas técnicas y reglas por método/rol
4. **Seed inicial**
  - crear inicializador idempotente que solo actúe con tabla vacía
  - persistir hashes BCrypt para `admin@demo.com` y `user@demo.com`
5. **Pruebas/validación**
  - validar seed + lectura paginada con `USER`
  - validar `401` credenciales inválidas
  - validar `403` en escritura con `USER`
  - validar CRUD con `ADMIN`

## Risks & Mitigation

1. **Datos legacy incompatibles en entorno local**
  - Riesgo: migración puede fallar si el volumen contiene datos previos que no cumplen el nuevo esquema.
  - Mitigación: declarar precondición de BD limpia y ejecutar `docker compose down -v` antes de `docker compose up -d --build`.

2. **Regresión de contratos CRUD/paginación**
  - Riesgo: cambios en DTO pueden romper clientes existentes.
  - Mitigación: mantener rutas y semántica de paginación; documentar cambios de payload en contrato y quickstart.

3. **Regresión operativa en Docker healthchecks**
  - Riesgo: endurecimiento de seguridad bloquee `/actuator/health`.
  - Mitigación: mantener matcher explícito `permitAll` y validar healthcheck tras despliegue local.

4. **Acoplamiento excesivo por cambios grandes en seguridad**
  - Riesgo: cambios simultáneos en múltiples capas compliquen rollback.
  - Mitigación: implementación incremental por orden definido y commits lógicos por fase.

## Post-Design Constitution Check

- Stack gate: PASS (sin cambios de stack/runtime base).
- API versioning gate: PASS (sin cambios de rutas base más allá de `/api/v1/**`).
- Security gate: PASS (Basic Auth + `Empleado` BD + BCrypt).
- Identity source gate: PASS (fuente final no in-memory).
- Authorization gate: PASS (`GET` para `ADMIN/USER`; escritura solo `ADMIN`).
- Data gate: PASS (PostgreSQL + Flyway).
- Runtime gate: PASS (2 contenedores + `/actuator/health` público).
- Documentation gate: PASS (OpenAPI mantiene `basicAuth` y `Authorize`).
- Pagination gate: PASS (se conserva `GET /api/v1/empleados` paginado).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
