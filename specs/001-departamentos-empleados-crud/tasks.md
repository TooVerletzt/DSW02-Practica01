# Tasks: CRUD Departamentos y Empleados

**Input**: Design documents from `/specs/001-departamentos-empleados-crud/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/openapi.yaml`, `quickstart.md`

**Tests/Evidence**: Este backlog incluye tareas de evidencia con comandos exactos para operacion, seguridad, reglas de negocio y paginacion.

## Format: `[ID] [P?] [Story] Description with file path`

- [P] = puede ejecutarse en paralelo
- [Story] = trazabilidad a historia de usuario (`[US1]`, `[US2]`, `[US3]`)
- Cada tarea incluye `Files`, `Done`, `Verify`

## Phase 1: Setup (Shared Context)

**Purpose**: Preparar artefactos y comandos de verificacion sin cambiar arquitectura.

- [X] T001 Alinear contrato de departamentos en `specs/001-departamentos-empleados-crud/contracts/openapi.yaml`
  Files: `specs/001-departamentos-empleados-crud/contracts/openapi.yaml`
  Done: Operaciones y codigos esperados de departamentos (`200/201/204/400/403/404/409`) estan declarados.
  Verify: `grep -n "/api/v1/departamentos\|201\|204\|400\|403\|404\|409" specs/001-departamentos-empleados-crud/contracts/openapi.yaml`

- [X] T002 [P] Consolidar guion de evidencias en `specs/001-departamentos-empleados-crud/quickstart.md`
  Files: `specs/001-departamentos-empleados-crud/quickstart.md`
  Done: Quickstart contiene pasos para seguridad por rol, 400/409 y paginacion.
  Verify: `grep -n "403\|409\|departamentoClave\|page=\|size=\|sort=" specs/001-departamentos-empleados-crud/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Base de datos, modelo y seguridad base antes de historias.

**CRITICAL**: Ninguna historia inicia hasta cerrar esta fase.

- [X] T003 Crear migracion de departamentos y FK nullable en `backend/src/main/resources/db/migration/V3__create_departamentos_and_empleado_fk.sql`
  Files: `backend/src/main/resources/db/migration/V3__create_departamentos_and_empleado_fk.sql`
  Done: Existe tabla `departamentos` y columna `departamento_clave` nullable en `empleados` con FK hacia `departamentos(clave)`.
  Verify: `grep -n "CREATE TABLE.*departamentos\|departamento_clave\|FOREIGN KEY" backend/src/main/resources/db/migration/V3__create_departamentos_and_empleado_fk.sql`

- [X] T004 [P] Crear entidad `Departamento` en `backend/src/main/java/com/dsw02/empleados/model/Departamento.java`
  Files: `backend/src/main/java/com/dsw02/empleados/model/Departamento.java`
  Done: Entidad JPA con `clave` (max 16) y `nombre` (max 100) validada.
  Verify: `grep -n "class Departamento\|clave\|nombre\|@Entity" backend/src/main/java/com/dsw02/empleados/model/Departamento.java`

- [X] T005 [P] Extender entidad `Empleado` con relacion opcional a departamento en `backend/src/main/java/com/dsw02/empleados/model/Empleado.java`
  Files: `backend/src/main/java/com/dsw02/empleados/model/Empleado.java`
  Done: Empleado tiene referencia nullable a `Departamento`.
  Verify: `grep -n "Departamento\|departamento" backend/src/main/java/com/dsw02/empleados/model/Empleado.java`

- [X] T006 Crear repositorio de departamentos en `backend/src/main/java/com/dsw02/empleados/repository/DepartamentoRepository.java`
  Files: `backend/src/main/java/com/dsw02/empleados/repository/DepartamentoRepository.java`
  Done: Repositorio con operaciones base y soporte para existencia por clave.
  Verify: `grep -n "interface DepartamentoRepository\|existsById" backend/src/main/java/com/dsw02/empleados/repository/DepartamentoRepository.java`

- [X] T007 [P] Extender repositorio de empleados para validaciones de relacion en `backend/src/main/java/com/dsw02/empleados/repository/EmpleadoRepository.java`
  Files: `backend/src/main/java/com/dsw02/empleados/repository/EmpleadoRepository.java`
  Done: Existe metodo para verificar empleados por departamento (ej. `existsByDepartamento...`).
  Verify: `grep -n "existsBy.*Departamento" backend/src/main/java/com/dsw02/empleados/repository/EmpleadoRepository.java`

- [X] T008 Confirmar reglas de seguridad para `/api/v1/departamentos` en `backend/src/main/java/com/dsw02/empleados/config/SecurityConfig.java`
  Files: `backend/src/main/java/com/dsw02/empleados/config/SecurityConfig.java`
  Done: `GET` permite `USER/ADMIN`; `POST/PUT/DELETE` solo `ADMIN`; `/actuator/health` sigue `permitAll`.
  Verify: `grep -n "HttpMethod.GET\|HttpMethod.POST\|HttpMethod.PUT\|HttpMethod.DELETE\|/actuator/health\|hasAnyRole\|hasRole" backend/src/main/java/com/dsw02/empleados/config/SecurityConfig.java`

- [X] T009 Validar compilacion base tras fundacion en `backend/pom.xml`
  Files: `backend/pom.xml`, `backend/src/main/resources/db/migration/V3__create_departamentos_and_empleado_fk.sql`
  Done: Compila sin errores con nuevos artefactos.
  Verify: `cd backend && mvn -DskipTests compile`

**Checkpoint**: Fundacion lista, historias desbloqueadas.

---

## Phase 3: User Story 1 - Gestionar Departamentos (Priority: P1)

**Goal**: CRUD de departamentos bajo `/api/v1/departamentos` con paginacion y validaciones.

**Independent Test**: CRUD admin y GET paginado con metadata, incluyendo invalidaciones `400`.

### Implementation for User Story 1

- [X] T010 [US1] Crear DTO create de departamento en `backend/src/main/java/com/dsw02/empleados/model/DepartamentoCreateRequest.java`
  Files: `backend/src/main/java/com/dsw02/empleados/model/DepartamentoCreateRequest.java`
  Done: DTO define `clave` max 16 y `nombre` max 100 con validaciones.
  Verify: `grep -n "clave\|nombre\|Size\|NotBlank" backend/src/main/java/com/dsw02/empleados/model/DepartamentoCreateRequest.java`

- [X] T011 [P] [US1] Crear DTO update de departamento en `backend/src/main/java/com/dsw02/empleados/model/DepartamentoUpdateRequest.java`
  Files: `backend/src/main/java/com/dsw02/empleados/model/DepartamentoUpdateRequest.java`
  Done: DTO update valida `nombre` max 100.
  Verify: `grep -n "nombre\|Size\|NotBlank" backend/src/main/java/com/dsw02/empleados/model/DepartamentoUpdateRequest.java`

- [X] T012 [P] [US1] Crear DTO response de departamento en `backend/src/main/java/com/dsw02/empleados/model/DepartamentoResponse.java`
  Files: `backend/src/main/java/com/dsw02/empleados/model/DepartamentoResponse.java`
  Done: DTO respuesta incluye `clave` y `nombre`.
  Verify: `grep -n "clave\|nombre" backend/src/main/java/com/dsw02/empleados/model/DepartamentoResponse.java`

- [X] T013 [US1] Implementar servicio de departamentos en `backend/src/main/java/com/dsw02/empleados/service/DepartamentoService.java`
  Files: `backend/src/main/java/com/dsw02/empleados/service/DepartamentoService.java`
  Done: CRUD completo con mapeo DTO y busqueda por clave.
  Verify: `grep -n "create\|findAll\|findByClave\|update\|delete" backend/src/main/java/com/dsw02/empleados/service/DepartamentoService.java`

- [X] T014 [US1] Implementar controller de departamentos en `backend/src/main/java/com/dsw02/empleados/controller/DepartamentoController.java`
  Files: `backend/src/main/java/com/dsw02/empleados/controller/DepartamentoController.java`
  Done: Expuestos `GET list/detail`, `POST`, `PUT`, `DELETE` bajo `/api/v1/departamentos`.
  Verify: `grep -n "@RequestMapping(\"/api/v1/departamentos\"\)\|@GetMapping\|@PostMapping\|@PutMapping\|@DeleteMapping" backend/src/main/java/com/dsw02/empleados/controller/DepartamentoController.java`

- [X] T015 [US1] Aplicar validaciones de paginacion/sort en `backend/src/main/java/com/dsw02/empleados/controller/DepartamentoController.java`
  Files: `backend/src/main/java/com/dsw02/empleados/controller/DepartamentoController.java`
  Done: `page<0`, `size<1`, `size>100`, `sort` invalido retornan `400`.
  Verify: `grep -n "page\|size\|sort\|BadRequestException" backend/src/main/java/com/dsw02/empleados/controller/DepartamentoController.java`

### Evidence for User Story 1

- [X] T016 [US1] Verificar GET departamentos con USER devuelve `200`
  Files: `specs/001-departamentos-empleados-crud/quickstart.md`
  Done: Evidencia de lectura autorizada para `USER`.
  Verify: `curl -i -u user@demo.com:user123 "http://localhost:8080/api/v1/departamentos?page=0&size=10&sort=clave,asc" | head -n 1`

- [X] T017 [US1] Verificar metadata paginada en GET departamentos
  Files: `specs/001-departamentos-empleados-crud/quickstart.md`
  Done: Respuesta contiene `content,totalElements,totalPages,number,size`.
  Verify: `curl -s -u user@demo.com:user123 "http://localhost:8080/api/v1/departamentos?page=0&size=10&sort=clave,asc" | grep -E "content|totalElements|totalPages|number|size"`

- [X] T018 [US1] Verificar invalidaciones de paginacion/sort retornan `400`
  Files: `specs/001-departamentos-empleados-crud/quickstart.md`
  Done: `page=-1`, `size=0`, `size=101`, `sort=bad` responden `400` con JSON estandar.
  Verify: `bash -lc 'for q in "page=-1&size=10&sort=clave,asc" "page=0&size=0&sort=clave,asc" "page=0&size=101&sort=clave,asc" "page=0&size=10&sort=invalido"; do code=$(curl -s -o /tmp/dep_err.json -w "%{http_code}" -u user@demo.com:user123 "http://localhost:8080/api/v1/departamentos?$q"); echo "$q => $code"; grep -E "timestamp|status|error|message|path" /tmp/dep_err.json >/dev/null && echo "json-ok"; done'`

---

## Phase 4: User Story 2 - Asociar Empleado a Departamento (Priority: P2)

**Goal**: Soportar `departamentoClave` opcional en create/update de empleado y validar inexistentes con `400`.

**Independent Test**: Create/update empleado con departamento valido, nulo e inexistente.

### Implementation for User Story 2

- [X] T019 [US2] Extender DTO create de empleado con `departamentoClave` opcional en `backend/src/main/java/com/dsw02/empleados/model/EmpleadoCreateRequest.java`
  Files: `backend/src/main/java/com/dsw02/empleados/model/EmpleadoCreateRequest.java`
  Done: DTO acepta `departamentoClave` nullable.
  Verify: `grep -n "departamentoClave" backend/src/main/java/com/dsw02/empleados/model/EmpleadoCreateRequest.java`

- [X] T020 [P] [US2] Extender DTO update de empleado con `departamentoClave` opcional en `backend/src/main/java/com/dsw02/empleados/model/EmpleadoUpdateRequest.java`
  Files: `backend/src/main/java/com/dsw02/empleados/model/EmpleadoUpdateRequest.java`
  Done: DTO update acepta `departamentoClave` nullable.
  Verify: `grep -n "departamentoClave" backend/src/main/java/com/dsw02/empleados/model/EmpleadoUpdateRequest.java`

- [X] T021 [P] [US2] Propagar `departamentoClave` en respuesta de empleado en `backend/src/main/java/com/dsw02/empleados/model/EmpleadoResponse.java`
  Files: `backend/src/main/java/com/dsw02/empleados/model/EmpleadoResponse.java`
  Done: Respuesta expone departamento asociado (clave o null) sin afectar campos existentes.
  Verify: `grep -n "departamento\|departamentoClave" backend/src/main/java/com/dsw02/empleados/model/EmpleadoResponse.java`

- [X] T022 [US2] Validar existencia de departamento en create/update empleado en `backend/src/main/java/com/dsw02/empleados/service/EmpleadoService.java`
  Files: `backend/src/main/java/com/dsw02/empleados/service/EmpleadoService.java`, `backend/src/main/java/com/dsw02/empleados/repository/DepartamentoRepository.java`
  Done: Si `departamentoClave` no existe, create/update responde `400` con JSON estandar.
  Verify: `grep -n "departamentoClave\|BadRequestException\|DepartamentoRepository" backend/src/main/java/com/dsw02/empleados/service/EmpleadoService.java`

### Evidence for User Story 2

- [X] T023 [US2] Verificar `400` en POST empleado con `departamentoClave` inexistente
  Files: `specs/001-departamentos-empleados-crud/quickstart.md`
  Done: POST empleado con `DEP-404` devuelve `400` y JSON estandar.
  Verify: `bash -lc 'curl -s -o /tmp/emp_post_baddep.json -w "%{http_code}\n" -u admin@demo.com:admin123 -X POST http://localhost:8080/api/v1/empleados -H "Content-Type: application/json" -d "{\"nombre\":\"Bad Dep\",\"direccion\":\"Dir\",\"telefono\":\"555\",\"email\":\"bad.dep.post@demo.com\",\"password\":\"secret123\",\"role\":\"USER\",\"departamentoClave\":\"DEP-404\"}"; grep -E "timestamp|status|error|message|path" /tmp/emp_post_baddep.json'`

- [X] T024 [US2] Verificar `400` en PUT empleado con `departamentoClave` inexistente
  Files: `specs/001-departamentos-empleados-crud/quickstart.md`
  Done: PUT sobre `EMP-1` con `DEP-404` devuelve `400` y JSON estandar.
  Verify: `bash -lc 'curl -s -o /tmp/emp_put_baddep.json -w "%{http_code}\n" -u admin@demo.com:admin123 -X PUT http://localhost:8080/api/v1/empleados/EMP-1 -H "Content-Type: application/json" -d "{\"nombre\":\"Admin Demo\",\"direccion\":\"N/A\",\"telefono\":\"N/A\",\"email\":\"admin@demo.com\",\"password\":\"admin123\",\"role\":\"ADMIN\",\"departamentoClave\":\"DEP-404\"}"; grep -E "timestamp|status|error|message|path" /tmp/emp_put_baddep.json'`

---

## Phase 5: User Story 3 - Borrado con Integridad y Seguridad (Priority: P3)

**Goal**: Bloquear borrado con empleados asignados (`409`) y permitirlo cuando no hay asignaciones (`204`) con seguridad por rol.

**Independent Test**: Evidencia de `403` con USER, CRUD admin de departamentos y regla `409/204`.

### Implementation for User Story 3

- [X] T025 [US3] Implementar regla `409` en delete departamento en `backend/src/main/java/com/dsw02/empleados/service/DepartamentoService.java`
  Files: `backend/src/main/java/com/dsw02/empleados/service/DepartamentoService.java`, `backend/src/main/java/com/dsw02/empleados/repository/EmpleadoRepository.java`
  Done: Si existen empleados asociados, delete lanza conflicto de negocio y no borra.
  Verify: `grep -n "409\|Conflict\|existsBy.*Departamento" backend/src/main/java/com/dsw02/empleados/service/DepartamentoService.java backend/src/main/java/com/dsw02/empleados/repository/EmpleadoRepository.java`

- [X] T026 [P] [US3] Mapear conflicto de negocio a JSON estandar en `backend/src/main/java/com/dsw02/empleados/config/ApiExceptionHandler.java`
  Files: `backend/src/main/java/com/dsw02/empleados/config/ApiExceptionHandler.java`, `backend/src/main/java/com/dsw02/empleados/service/*.java`
  Done: Conflictos de borrado responden `409` con `timestamp,status,error,message,path`.
  Verify: `grep -n "CONFLICT\|409\|timestamp\|status\|error\|message\|path" backend/src/main/java/com/dsw02/empleados/config/ApiExceptionHandler.java`

### Evidence for User Story 3

- [X] T027 [US3] Verificar USER no puede POST departamentos (`403`)
  Files: `specs/001-departamentos-empleados-crud/quickstart.md`
  Done: POST con USER bloqueado por autorizacion.
  Verify: `curl -i -u user@demo.com:user123 -X POST http://localhost:8080/api/v1/departamentos -H 'Content-Type: application/json' -d '{"clave":"DEP-USER-01","nombre":"Dept User"}' | head -n 1`

- [X] T028 [US3] Verificar USER no puede PUT departamentos (`403`)
  Files: `specs/001-departamentos-empleados-crud/quickstart.md`
  Done: PUT con USER bloqueado por autorizacion.
  Verify: `curl -i -u user@demo.com:user123 -X PUT http://localhost:8080/api/v1/departamentos/DEP-USER-01 -H 'Content-Type: application/json' -d '{"nombre":"Dept User Upd"}' | head -n 1`

- [X] T029 [US3] Verificar USER no puede DELETE departamentos (`403`)
  Files: `specs/001-departamentos-empleados-crud/quickstart.md`
  Done: DELETE con USER bloqueado por autorizacion.
  Verify: `curl -i -u user@demo.com:user123 -X DELETE http://localhost:8080/api/v1/departamentos/DEP-USER-01 | head -n 1`

- [X] T030 [US3] Verificar CRUD completo de departamentos con ADMIN (`POST=201`, `PUT=200`, `DELETE=204`, `GET after delete=404`)
  Files: `specs/001-departamentos-empleados-crud/quickstart.md`
  Done: Evidencia completa con clave fija `DEP-ADMIN-01`.
  Verify: `bash -lc 'echo -n "POST="; curl -s -o /dev/null -w "%{http_code}" -u admin@demo.com:admin123 -X POST http://localhost:8080/api/v1/departamentos -H "Content-Type: application/json" -d "{\"clave\":\"DEP-ADMIN-01\",\"nombre\":\"Admin Dept\"}"; echo; echo -n "PUT="; curl -s -o /dev/null -w "%{http_code}" -u admin@demo.com:admin123 -X PUT http://localhost:8080/api/v1/departamentos/DEP-ADMIN-01 -H "Content-Type: application/json" -d "{\"nombre\":\"Admin Dept Upd\"}"; echo; echo -n "DELETE="; curl -s -o /dev/null -w "%{http_code}" -u admin@demo.com:admin123 -X DELETE http://localhost:8080/api/v1/departamentos/DEP-ADMIN-01; echo; echo -n "GET_AFTER_DELETE="; curl -s -o /dev/null -w "%{http_code}" -u user@demo.com:user123 http://localhost:8080/api/v1/departamentos/DEP-ADMIN-01; echo'`

- [X] T031 [US3] Verificar regla negocio `409` al borrar departamento con empleados asignados
  Files: `specs/001-departamentos-empleados-crud/quickstart.md`
  Done: `DELETE DEP-LINK-01` retorna `409` y JSON estandar tras asignar empleado.
  Verify: `bash -lc 'curl -s -o /dev/null -w "%{http_code}\n" -u admin@demo.com:admin123 -X POST http://localhost:8080/api/v1/departamentos -H "Content-Type: application/json" -d "{\"clave\":\"DEP-LINK-01\",\"nombre\":\"Dept Link\"}"; curl -s -o /dev/null -w "%{http_code}\n" -u admin@demo.com:admin123 -X POST http://localhost:8080/api/v1/empleados -H "Content-Type: application/json" -d "{\"nombre\":\"Emp Link\",\"direccion\":\"Dir\",\"telefono\":\"555\",\"email\":\"emp.link@demo.com\",\"password\":\"secret123\",\"role\":\"USER\",\"departamentoClave\":\"DEP-LINK-01\"}"; curl -s -o /tmp/dep409.json -w "%{http_code}\n" -u admin@demo.com:admin123 -X DELETE http://localhost:8080/api/v1/departamentos/DEP-LINK-01; grep -E "timestamp|status|error|message|path" /tmp/dep409.json'`

---

## Phase 6: Polish & Cross-Cutting Evidence

**Purpose**: Cierre operativo y evidencia integral del feature.

- [X] T032 Ejecutar reinicio limpio de entorno Docker
  Files: `docker-compose.yml`
  Done: Entorno se reinicia desde volumen limpio.
  Verify: `docker compose down -v && docker compose up -d --build`

- [X] T033 Validar estado healthy de backend y postgres
  Files: `docker-compose.yml`
  Done: Ambos contenedores reportan `healthy`.
  Verify: `docker compose ps`

- [X] T034 Validar `/actuator/health` sin autenticacion (`200`)
  Files: `backend/src/main/java/com/dsw02/empleados/config/SecurityConfig.java`
  Done: Healthcheck accesible sin credenciales.
  Verify: `curl -i http://localhost:8080/actuator/health | head -n 1`

- [X] T035 Ejecutar compilacion final del backend
  Files: `backend/pom.xml`
  Done: Build pasa sin errores.
  Verify: `cd backend && mvn -DskipTests compile`

- [X] T036 Verificar evidencia Swagger UI + Authorize (`basicAuth`)
  Files: `specs/001-departamentos-empleados-crud/contracts/openapi.yaml`, `specs/001-departamentos-empleados-crud/quickstart.md`
  Done: Swagger UI es accesible en `http://localhost:8080/swagger-ui/index.html`, existe boton `Authorize` en UI y el contrato declara `basicAuth`.
  Verify: `bash -lc 'curl -fsSL http://localhost:8080/swagger-ui/index.html | grep -Ei "swagger-ui|authorize" && grep -n "basicAuth" specs/001-departamentos-empleados-crud/contracts/openapi.yaml'`

- [X] T037 Verificar no-regresion de `GET /api/v1/empleados` con USER (`200`)
  Files: `specs/001-departamentos-empleados-crud/quickstart.md`
  Done: El endpoint existente de listado de empleados sigue operativo para `USER` autenticado.
  Verify: `curl -i -u user@demo.com:user123 "http://localhost:8080/api/v1/empleados?page=0&size=5&sort=clave,asc" | head -n 1`

- [X] T038 Verificar no-regresion de `GET /api/v1/empleados/{clave}` con ADMIN (`200`)
  Files: `specs/001-departamentos-empleados-crud/quickstart.md`
  Done: `GET` por clave de empleado existente responde `200` para `ADMIN`; si `EMP-1` no existe, se crea empleado via `POST` y se usa su `clave`.
  Verify: `bash -lc 'code=$(curl -s -o /dev/null -w "%{http_code}" -u admin@demo.com:admin123 http://localhost:8080/api/v1/empleados/EMP-1); if [ "$code" != "200" ]; then resp=$(curl -s -u admin@demo.com:admin123 -X POST http://localhost:8080/api/v1/empleados -H "Content-Type: application/json" -d "{\"nombre\":\"Emp Smoke\",\"direccion\":\"Dir\",\"telefono\":\"555-000\",\"email\":\"emp.smoke.get@demo.com\",\"password\":\"secret123\",\"role\":\"USER\"}"); clave=$(printf "%s" "$resp" | sed -n "s/.*\"clave\":\"\([^\"]*\)\".*/\1/p"); curl -i -u admin@demo.com:admin123 "http://localhost:8080/api/v1/empleados/$clave" | head -n 1; else curl -i -u admin@demo.com:admin123 http://localhost:8080/api/v1/empleados/EMP-1 | head -n 1; fi'`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 (Setup): inicia de inmediato.
- Phase 2 (Foundational): depende de Setup y bloquea historias.
- Phase 3 (US1): depende de Foundational.
- Phase 4 (US2): depende de Foundational y reutiliza base de US1.
- Phase 5 (US3): depende de Foundational y utiliza componentes de US1/US2.
- Phase 6 (Polish): depende de cierre funcional de US1-US3.

### User Story Dependencies

- US1: independiente tras fundacion.
- US2: requiere recursos de departamento ya disponibles.
- US3: requiere relacion empleado-departamento y control de seguridad activo.

### Parallel Opportunities

- T002 paralelo con T001.
- T004 y T005 en paralelo tras T003.
- T010/T011/T012 en paralelo.
- T019/T020/T021 en paralelo.
- T026 paralelo con T025.
- T027/T028/T029 pueden ejecutarse en paralelo.

---

## Implementation Strategy

### MVP First (US1)

1. Completar Setup + Foundational.
2. Entregar US1 (CRUD departamentos + paginacion/validaciones).
3. Validar evidencias T016-T018.

### Incremental Delivery

1. US1: base del nuevo recurso `Departamento`.
2. US2: integracion de `departamentoClave` en empleados con `400` estandar.
3. US3: regla `409` de borrado y seguridad por rol.
4. Polish: evidencia operativa A-D completa.
