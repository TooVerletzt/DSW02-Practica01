# Tasks: CRUD de Empleados

**Input**: Design documents from `/specs/002-crud-empleados/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No se generan tareas de tests automáticos porque la especificación no exige TDD ni suites de prueba explícitas.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicializar proyecto backend y estructura base para Spring Boot

- [X] T001 Crear módulo backend Maven en backend/pom.xml
- [X] T002 Crear clase de arranque Spring Boot en backend/src/main/java/com/dsw02/empleados/EmpleadosApplication.java
- [X] T003 [P] Crear estructura de paquetes api/service/domain/infrastructure en backend/src/main/java/com/dsw02/empleados/
- [X] T004 [P] Crear configuración base de aplicación en backend/src/main/resources/application.yml
- [X] T005 [P] Crear runtime local PostgreSQL en docker-compose.yml

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura bloqueante antes de implementar cualquier historia

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Configurar dependencias Spring Web, Data JPA, Security, Validation, PostgreSQL y OpenAPI en backend/pom.xml
- [X] T007 [P] Crear migración inicial de tabla empleados en backend/src/main/resources/db/migration/V1__create_empleados.sql
- [X] T008 [P] Configurar datasource y JPA para PostgreSQL en backend/src/main/resources/application.yml
- [X] T009 [P] Implementar seguridad HTTP Basic + rol admin en backend/src/main/java/com/dsw02/empleados/infrastructure/security/SecurityConfig.java
- [X] T010 [P] Implementar configuración OpenAPI/Swagger en backend/src/main/java/com/dsw02/empleados/infrastructure/config/OpenApiConfig.java
- [X] T011 Crear entidad Empleado en backend/src/main/java/com/dsw02/empleados/domain/Empleado.java
- [X] T012 [P] Crear repositorio JPA EmpleadoRepository en backend/src/main/java/com/dsw02/empleados/domain/EmpleadoRepository.java
- [X] T013 Crear manejo global de errores HTTP (400/401/403/404) en backend/src/main/java/com/dsw02/empleados/api/ApiExceptionHandler.java
- [X] T014 Crear validadores/normalizadores comunes (formato `EMP-<número>`, bloqueo de `clave` manual en alta y trim de textos) en backend/src/main/java/com/dsw02/empleados/service/EmpleadoValidationService.java

**Checkpoint**: Foundation lista; se puede implementar cada user story

---

## Phase 3: User Story 1 - Registrar empleados (Priority: P1) 🎯 MVP

**Goal**: Permitir alta de empleados con generación automática de clave `EMP-<número>` y validaciones de longitud

**Independent Test**: Crear empleado válido sin enviar `clave`, validar generación `EMP-<número>` única; intentar enviar `clave` manual y validar rechazo

### Implementation for User Story 1

- [X] T015 [P] [US1] Crear DTO de alta sin campo `clave` en backend/src/main/java/com/dsw02/empleados/api/dto/EmpleadoCreateRequest.java
- [X] T016 [P] [US1] Crear DTO de respuesta en backend/src/main/java/com/dsw02/empleados/api/dto/EmpleadoResponse.java
- [X] T017 [US1] Implementar lógica de alta con trim, límites y generación automática de `clave` `EMP-<número>` en backend/src/main/java/com/dsw02/empleados/service/EmpleadoService.java
- [X] T018 [US1] Implementar endpoint POST /empleados en backend/src/main/java/com/dsw02/empleados/api/EmpleadoController.java
- [X] T019 [US1] Mapear rechazo por `clave` manual o payload inválido a `400` en backend/src/main/java/com/dsw02/empleados/api/ApiExceptionHandler.java
- [X] T020 [US1] Sincronizar contrato OpenAPI de alta con `clave` autogenerada en specs/002-crud-empleados/contracts/openapi.yaml

**Checkpoint**: User Story 1 funcional y demostrable como MVP

---

## Phase 4: User Story 2 - Consultar y actualizar empleados (Priority: P2)

**Goal**: Permitir consulta por clave/listado y actualización de datos existentes

**Independent Test**: Consultar empleado por clave y listado sin paginación; actualizar campos válidos y verificar persistencia

### Implementation for User Story 2

- [X] T021 [P] [US2] Crear DTO de actualización en backend/src/main/java/com/dsw02/empleados/api/dto/EmpleadoUpdateRequest.java
- [X] T022 [US2] Implementar consulta por clave y listado completo con validación de formato `EMP-<número>` en backend/src/main/java/com/dsw02/empleados/service/EmpleadoService.java
- [X] T023 [US2] Implementar endpoints GET /empleados y GET /empleados/{clave} en backend/src/main/java/com/dsw02/empleados/api/EmpleadoController.java
- [X] T024 [US2] Implementar actualización con trim, longitudes, validación de formato de clave y `404` inexistente en backend/src/main/java/com/dsw02/empleados/service/EmpleadoService.java
- [X] T025 [US2] Implementar endpoint PUT /empleados/{clave} en backend/src/main/java/com/dsw02/empleados/api/EmpleadoController.java
- [X] T026 [US2] Sincronizar contrato OpenAPI de consulta/actualización con clave `EMP-<número>` en specs/002-crud-empleados/contracts/openapi.yaml

**Checkpoint**: User Stories 1 y 2 funcionan de forma independiente

---

## Phase 5: User Story 3 - Eliminar empleados (Priority: P3)

**Goal**: Permitir eliminación física por clave con respuesta consistente

**Independent Test**: Eliminar empleado existente (`204`) y verificar que no aparezca en consultas posteriores; inexistente retorna `404`

### Implementation for User Story 3

- [X] T027 [US3] Implementar borrado físico con validación de formato de clave y `404` para inexistente en backend/src/main/java/com/dsw02/empleados/service/EmpleadoService.java
- [X] T028 [US3] Implementar endpoint DELETE /empleados/{clave} en backend/src/main/java/com/dsw02/empleados/api/EmpleadoController.java
- [X] T029 [US3] Ajustar respuesta `204 No Content` sin cuerpo en backend/src/main/java/com/dsw02/empleados/api/EmpleadoController.java
- [X] T030 [US3] Sincronizar contrato OpenAPI de eliminación con clave `EMP-<número>` en specs/002-crud-empleados/contracts/openapi.yaml

**Checkpoint**: Todas las user stories CRUD están completas y operativas

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cierre de documentación y validación transversal

- [X] T031 [P] Actualizar guía de ejecución y validación manual en specs/002-crud-empleados/quickstart.md
- [X] T032 [P] Documentar checklist de cumplimiento funcional en specs/002-crud-empleados/checklists/requirements.md
- [X] T033 Ejecutar validación end-to-end de quickstart y registrar resultados en specs/002-crud-empleados/checklists/requirements.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias
- **Foundational (Phase 2)**: Depende de Phase 1; bloquea todas las historias
- **User Stories (Phase 3+)**: Dependen de Foundational completada
- **Polish (Phase 6)**: Depende de finalizar historias objetivo

### User Story Dependencies

- **US1 (P1)**: Inicia tras Phase 2; sin dependencia en otras historias
- **US2 (P2)**: Inicia tras Phase 2; independiente funcionalmente de US1
- **US3 (P3)**: Inicia tras Phase 2; independiente funcionalmente de US1/US2

### Within Each User Story

- DTOs/contratos antes de endpoints
- Lógica de servicio antes de controlador
- Manejo de errores y códigos HTTP al cerrar cada historia

### Parallel Opportunities

- Fase 1: T003, T004 y T005 en paralelo
- Fase 2: T007, T008, T009 y T010 en paralelo; T012 en paralelo tras T011
- Fase 3 (US1): T015 y T016 en paralelo
- Fase 4 (US2): T021 en paralelo con preparación de consultas
- Fase 6: T031 y T032 en paralelo

---

## Parallel Example: User Story 1

```bash
# Paralelizar DTOs de alta y respuesta
Task: "T015 [US1] Crear DTO de alta en backend/src/main/java/com/dsw02/empleados/api/dto/EmpleadoCreateRequest.java"
Task: "T016 [US1] Crear DTO de respuesta en backend/src/main/java/com/dsw02/empleados/api/dto/EmpleadoResponse.java"
```

## Parallel Example: User Story 2

```bash
# Preparar DTO de actualización mientras se alista lógica de consulta
Task: "T021 [US2] Crear DTO de actualización en backend/src/main/java/com/dsw02/empleados/api/dto/EmpleadoUpdateRequest.java"
Task: "T022 [US2] Implementar consulta por clave y listado completo con validación de formato EMP-<número> en backend/src/main/java/com/dsw02/empleados/service/EmpleadoService.java"
```

## Parallel Example: User Story 3

```bash
# Tras lógica de servicio de borrado, cerrar endpoint y respuesta HTTP
Task: "T028 [US3] Implementar endpoint DELETE /empleados/{clave} en backend/src/main/java/com/dsw02/empleados/api/EmpleadoController.java"
Task: "T029 [US3] Ajustar respuesta 204 No Content sin cuerpo en backend/src/main/java/com/dsw02/empleados/api/EmpleadoController.java"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 (Setup)
2. Completar Phase 2 (Foundational)
3. Completar Phase 3 (US1)
4. Validar alta con clave autogenerada `EMP-<número>` + rechazo de clave manual
5. Demostrar MVP

### Incremental Delivery

1. Setup + Foundational
2. Entregar US1 (alta)
3. Entregar US2 (consulta/actualización)
4. Entregar US3 (eliminación)
5. Ejecutar polish final de documentación y checklist

### Parallel Team Strategy

1. Equipo completo en Setup + Foundational
2. Luego, trabajo por historia en paralelo según capacidad
3. Integración final con validación quickstart y contratos OpenAPI

---

## Notes

- Tareas con `[P]` son paralelizables por archivo y dependencia
- Tareas con `[US#]` trazan implementación por historia
- Cada historia mantiene criterio de prueba independiente desde `spec.md`
- `tasks.md` está listo para ejecución por un agente de implementación
