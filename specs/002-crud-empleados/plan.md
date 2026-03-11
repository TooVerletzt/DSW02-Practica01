# Implementation Plan: CRUD de Empleados

**Branch**: `002-crud-empleados` | **Date**: 2026-02-26 | **Spec**: `/specs/002-crud-empleados/spec.md`
**Input**: Feature specification from `/specs/002-crud-empleados/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implementar un CRUD de empleados con clave autogenerada en formato
`EMP-<número>` (identificador compuesto lógico: prefijo fijo + consecutivo
numérico), campos de texto (`nombre`, `dirección`, `teléfono`) de hasta 100
caracteres, borrado físico, listado sin paginación, y control de acceso
mediante autenticación + rol `admin`. La implementación técnica seguirá Spring
Boot 3 + Java 17, PostgreSQL como persistencia, ejecución local en Docker y
documentación API con OpenAPI/Swagger.

## Technical Context

**Language/Version**: Java 17  
**Primary Dependencies**: Spring Boot 3 (Web, Data JPA, Security, Validation), PostgreSQL Driver, springdoc-openapi  
**Storage**: PostgreSQL  
**Testing**: JUnit 5 + Spring Boot Test + MockMvc  
**Target Platform**: Linux server (containerized local/dev runtime)
**Project Type**: Web service (REST API)  
**Performance Goals**: Sin objetivo de performance formal en este alcance (MVP funcional)  
**Constraints**: HTTP Basic Auth obligatoria, sin paginación en listado, longitud máxima 100 en campos de texto, `clave` autogenerada con formato `EMP-<número>`  
**Scale/Scope**: Módulo único de empleados para uso administrativo interno; alcance MVP

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Stack gate: Uses Spring Boot 3 and Java 17.
- Security gate: Enforces HTTP Basic Authentication for protected endpoints.
- Data gate: Uses PostgreSQL as the persistent store.
- Runtime gate: Supports Docker-based local execution for app + PostgreSQL.
- Documentation gate: Includes Swagger/OpenAPI for API contract visibility.

Pre-Phase 0 status: PASS (all gates aligned with constitution and feature scope).

## Project Structure

### Documentation (this feature)

```text
specs/002-crud-empleados/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
specs/
└── 002-crud-empleados/

# Planned implementation layout for this feature
backend/
├── src/main/java/.../empleados/
│   ├── api/
│   ├── service/
│   ├── domain/
│   └── infrastructure/
├── src/main/resources/
│   └── application.yml
└── src/test/java/.../empleados/

docker-compose.yml
```

**Structure Decision**: Se adopta estructura de web-service con módulo
`backend/` para implementar API REST de empleados. El repositorio actualmente
contiene sólo especificaciones; la estructura fuente mostrada arriba será creada
en implementación para cumplir la constitución técnica (Spring Boot +
PostgreSQL + Docker + OpenAPI).

## Post-Design Constitution Check

- Stack gate: PASS (Spring Boot 3 + Java 17 definidos en contexto técnico y artefactos).
- Security gate: PASS (contrato define Basic Auth y separación 401/403).
- Data gate: PASS (modelo y quickstart orientados a PostgreSQL).
- Runtime gate: PASS (quickstart exige `docker-compose` para PostgreSQL local).
- Documentation gate: PASS (contrato OpenAPI incluido en `/contracts`).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
