# Implementation Plan: CRUD de Empleados API v1

**Branch**: `001-crud-empleados-api-v1` | **Date**: 2026-03-05 | **Spec**: `/specs/001-crud-empleados-api-v1/spec.md`
**Input**: Feature specification from `/specs/001-crud-empleados-api-v1/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Aplicar cambios incrementales y de bajo impacto al backend existente para:
1) versionar endpoints de empleados bajo `/api/v1/empleados`,
2) reforzar seguridad por rol (GET autenticado para `ADMIN/USER`; escritura solo `ADMIN`),
3) implementar paginación real en el listado con `page`, `size`, `sort` y respuesta `Page`,
4) mantener Swagger y healthchecks operativos (`/swagger-ui/**`, `/v3/api-docs/**`, `/actuator/health`).

Se conserva la arquitectura actual (controller/config/model/repository/service)
sin reestructurar proyecto ni introducir capas nuevas.

## Technical Context

**Language/Version**: Java 17  
**Primary Dependencies**: Spring Boot 3 (Web, Data JPA, Security, Validation, Actuator), Spring Data Pageable, springdoc-openapi  
**Storage**: PostgreSQL  
**Testing**: Validación manual por curl + verificación operativa de Docker Compose healthchecks  
**Target Platform**: Linux server / Docker local runtime  
**Project Type**: Backend web service (REST API)  
**Performance Goals**: Sin objetivo formal nuevo; paginación para evitar respuestas no acotadas  
**Constraints**: Cambios mínimos sin reestructurar proyecto; mantener endpoints técnicos actuales y flujo local `mvn spring-boot:run`  
**Scale/Scope**: Ajuste incremental del módulo actual de empleados (versionado, auth por rol, paginación)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Stack gate: Uses Spring Boot 3 and Java 17.
- API versioning gate: Exposes business REST endpoints only under `/api/v1` (except `/swagger-ui/**`, `/v3/api-docs/**`, `/actuator/**`).
- Security gate: Enforces HTTP Basic Authentication with fixed local test admin credential `admin/admin123`.
- Authorization gate: Requires role `ADMIN` for write operations (`POST`, `PUT`, `DELETE`).
- Data gate: Uses PostgreSQL as the persistent store.
- Runtime gate: Supports Docker-based local execution for app + PostgreSQL.
- Documentation gate: Includes Swagger/OpenAPI with `basicAuth` Authorize support.
- Pagination gate: Employee list endpoints support `page`, `size`, `sort` and return paginated metadata.

Pre-Phase 0 status: PASS.

## Project Structure

### Documentation (this feature)

```text
specs/001-crud-empleados-api-v1/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/main/java/com/dsw02/empleados/
│   ├── controller/
│   ├── config/
│   ├── model/
│   ├── repository/
│   └── service/
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/
└── pom.xml

docker-compose.yml
specs/001-crud-empleados-api-v1/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/openapi.yaml
```

**Structure Decision**: Mantener la estructura backend actual y realizar cambios
quirúrgicos sobre controller/service/repository/config y contrato OpenAPI.

## Planned File Touch List (Implementation)

- `backend/src/main/java/com/dsw02/empleados/controller/EmpleadoController.java`
- `backend/src/main/java/com/dsw02/empleados/service/EmpleadoService.java`
- `backend/src/main/java/com/dsw02/empleados/repository/EmpleadoRepository.java`
- `backend/src/main/java/com/dsw02/empleados/config/SecurityConfig.java`
- `backend/src/main/java/com/dsw02/empleados/config/OpenApiConfig.java`
- `backend/src/main/resources/application.yml` (solo si se requiere ajuste de actuator exposure)
- `specs/001-crud-empleados-api-v1/contracts/openapi.yaml`
- `specs/001-crud-empleados-api-v1/quickstart.md`
- `docker-compose.yml` (solo verificación de healthchecks; sin cambios si ya cumple)

## Post-Design Constitution Check

- Stack gate: PASS (sin cambio de stack).
- API versioning gate: PASS (rutas migradas a `/api/v1/**`).
- Security/Authorization gates: PASS (Basic Auth + `ADMIN` en escritura, `GET` autenticado `ADMIN/USER`).
- Runtime gate: PASS (healthcheck en `/actuator/health` público, compose funcional).
- Documentation gate: PASS (OpenAPI con rutas versionadas y `basicAuth`).
- Pagination gate: PASS (GET listado con `page`, `size`, `sort` + metadatos de página).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
