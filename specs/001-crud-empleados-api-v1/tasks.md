# Tasks: CRUD de Empleados API v1

**Input**: Design documents from `/specs/001-crud-empleados-api-v1/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No se generan tareas de pruebas automatizadas; la validación requerida en esta feature es manual con curl/Swagger y healthchecks operativos.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar baseline documental y de ejecución para implementar cambios incrementales.

- [X] T001 Validar baseline de documentación y alcance en specs/001-crud-empleados-api-v1/spec.md
- [X] T002 [P] Confirmar lista de archivos objetivo en specs/001-crud-empleados-api-v1/plan.md
- [X] T003 [P] Verificar prerequisitos operativos en specs/001-crud-empleados-api-v1/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Alinear contratos y configuración base que bloquean todas las historias.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Actualizar contrato base versionado y seguridad global en specs/001-crud-empleados-api-v1/contracts/openapi.yaml
- [X] T005 [P] Ajustar esquema OpenAPI `basicAuth` y operaciones documentadas en backend/src/main/java/com/dsw02/empleados/config/OpenApiConfig.java
- [X] T006 [P] Preparar reglas base de acceso técnico (`/swagger-ui/**`, `/v3/api-docs/**`, `/actuator/health`) en backend/src/main/java/com/dsw02/empleados/config/SecurityConfig.java

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Versionado consistente de rutas (Priority: P1) 🎯 MVP

**Goal**: Publicar el CRUD únicamente bajo `/api/v1/empleados` sin endpoint funcional equivalente fuera del prefijo.

**Independent Test**: Consumir operaciones CRUD en `/api/v1/empleados` y verificar que rutas de negocio sin prefijo no atienden el CRUD.

### Implementation for User Story 1

- [X] T007 [US1] Migrar `@RequestMapping` base a `/api/v1/empleados` en backend/src/main/java/com/dsw02/empleados/controller/EmpleadoController.java
- [X] T008 [P] [US1] Sincronizar documentación de rutas CRUD versionadas en specs/001-crud-empleados-api-v1/contracts/openapi.yaml
- [X] T009 [US1] Validar mapeo de errores/validaciones tras versionado en backend/src/main/java/com/dsw02/empleados/config/ApiExceptionHandler.java

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Listado paginado de empleados (Priority: P2)

**Goal**: Entregar `GET /api/v1/empleados` con `page`, `size`, `sort` y respuesta paginada con metadatos.

**Independent Test**: Invocar listado con y sin parámetros y verificar `content`, `totalElements`, `totalPages`, `number`, `size`.

### Implementation for User Story 2

- [X] T010 [US2] Extender acceso paginado en repository usando `Pageable` en backend/src/main/java/com/dsw02/empleados/repository/EmpleadoRepository.java
- [X] T011 [US2] Implementar servicio de listado paginado y mapeo a `EmpleadoResponse` en backend/src/main/java/com/dsw02/empleados/service/EmpleadoService.java
- [X] T012 [US2] Implementar parámetros `page`, `size`, `sort` con defaults (`0`, `10`, `clave,asc`) en backend/src/main/java/com/dsw02/empleados/controller/EmpleadoController.java
- [X] T013 [P] [US2] Ajustar contrato de `EmpleadoPage` y query params de listado en specs/001-crud-empleados-api-v1/contracts/openapi.yaml
- [X] T014 [US2] Validar y documentar errores de paginación inválida (`page < 0`, `size < 1`, `size > 100`, `sort` inválido) con `400` y formato estándar de `ApiExceptionHandler` en backend/src/main/java/com/dsw02/empleados/controller/EmpleadoController.java, backend/src/main/java/com/dsw02/empleados/config/ApiExceptionHandler.java y specs/001-crud-empleados-api-v1/contracts/openapi.yaml

**Checkpoint**: User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Seguridad por rol en escritura (Priority: P3)

**Goal**: Mantener Basic Auth y asegurar que escritura sea solo `ADMIN`, mientras lectura autenticada permite `ADMIN/USER`.

**Independent Test**: Comparar `POST/PUT/DELETE` con `admin` vs `user`; validar `GET` autenticado para ambos roles.

### Implementation for User Story 3

- [X] T015 [US3] Definir autorización por método y roles (`GET` para `ADMIN/USER`, escritura solo `ADMIN`) en backend/src/main/java/com/dsw02/empleados/config/SecurityConfig.java
- [X] T016 [P] [US3] Asegurar usuarios in-memory `admin/admin123` y `user/user123` con roles correctos en backend/src/main/java/com/dsw02/empleados/config/SecurityConfig.java
- [X] T017 [P] [US3] Reflejar reglas de autenticación/autorización por operación en specs/001-crud-empleados-api-v1/contracts/openapi.yaml

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Consolidar coherencia funcional y validación manual final del alcance.

- [X] T018 [P] Actualizar escenarios finales de verificación manual en specs/001-crud-empleados-api-v1/quickstart.md
- [X] T019 Verificar que `docker-compose.yml` mantiene healthchecks operativos sin credenciales embebidas en comandos
- [X] T020 Ejecutar validación manual end-to-end (curl/Swagger/health) según specs/001-crud-empleados-api-v1/quickstart.md
- [X] T021 Ejecutar evidencia explícita de persistencia DB en Docker: levantar `docker compose`, crear empleado con `POST /api/v1/empleados` (admin), listar con `GET /api/v1/empleados` (admin o user) y confirmar persistencia del registro según specs/001-crud-empleados-api-v1/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed in paralelo si hay capacidad
  - Recomendado en orden de prioridad P1 → P2 → P3
- **Polish (Phase 6)**: Depends on user stories completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - no dependency on other stories
- **User Story 2 (P2)**: Depends on US1 route versioning being in place
- **User Story 3 (P3)**: Depends on US1 route versioning and applies over endpoints ya versionados

### Within Each User Story

- Contrato/documentación de historia puede ejecutarse en paralelo cuando está marcado [P]
- Repositorio antes de servicio, servicio antes de controlador para cambios de flujo de datos
- Configuración de seguridad antes de validación manual de permisos
- Historia terminada y validada antes de moverse a polish

### Parallel Opportunities

- **Phase 1**: T002 y T003 en paralelo
- **Phase 2**: T005 y T006 en paralelo
- **US1**: T008 en paralelo con T007
- **US2**: T013 en paralelo con T010–T012
- **US3**: T016 y T017 en paralelo con T015
- **Polish**: T018 y T019 en paralelo; T020 al final y T021 como evidencia de persistencia

---

## Parallel Example: User Story 2

```bash
# Ejecutar en paralelo (distintos archivos):
Task: "Extender acceso paginado en repository usando Pageable en backend/src/main/java/com/dsw02/empleados/repository/EmpleadoRepository.java"
Task: "Ajustar contrato de EmpleadoPage y query params de listado en specs/001-crud-empleados-api-v1/contracts/openapi.yaml"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Confirmar rutas de negocio solo en `/api/v1/empleados`

### Incremental Delivery

1. Setup + Foundational
2. Add US1 → validar
3. Add US2 → validar paginación
4. Add US3 → validar auth/roles
5. Polish y validación manual E2E

### Parallel Team Strategy

1. Equipo completa Setup + Foundational
2. Luego en paralelo:
   - Dev A: tareas de US2 en repository/service/controller
   - Dev B: tareas de US3 en security + contrato
3. Cierre conjunto en Phase 6 con quickstart + healthchecks

---

## Notes

- Todas las tareas cumplen formato checklist con ID secuencial y ruta de archivo.
- Se omitieron tareas de pruebas automatizadas porque la especificación actual exige validación manual.
- Cada historia mantiene criterio de prueba independiente para demo incremental.
