# Tasks: Empleado DB Auth (Basic Auth MVP)

**Input**: Design documents from `/specs/003-empleado-db-auth/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml

**Tests/Evidence**: Incluidas como tareas ejecutables con comandos exactos (`docker compose`, `curl`, `psql`).

## Format: `[ID] [P?] [Story] Description with file path`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencia directa)
- **[Story]**: US1, US2, US3 para trazabilidad por historia

## Phase 1: Setup (Shared Context)

**Purpose**: Preparar evidencia y puntos de control sin tocar arquitectura.

- [ ] T001 Actualizar matriz de verificación base en specs/003-empleado-db-auth/quickstart.md; Done: incluye comandos para 200/401/403/201 y paginación; Verify: `grep -n "401\|403\|201\|/actuator/health\|/api/v1/empleados" specs/003-empleado-db-auth/quickstart.md`
- [ ] T002 [P] Alinear ejemplos de seguridad y payload auth en specs/003-empleado-db-auth/contracts/openapi.yaml; Done: esquemas contienen `email`, `password`, `role` y `basicAuth`; Verify: `grep -n "basicAuth\|email\|password\|role" specs/003-empleado-db-auth/contracts/openapi.yaml`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Cambios base que bloquean todas las historias (migración + modelo + repo).

**⚠️ CRITICAL**: Ninguna historia inicia hasta cerrar esta fase.

- [ ] T003 Crear migración Flyway en backend/src/main/resources/db/migration/V2__add_auth_fields_to_empleados.sql; Done: agrega `email`, `password_hash`, `role`; Verify: `grep -n "email\|password_hash\|role" backend/src/main/resources/db/migration/V2__add_auth_fields_to_empleados.sql`
- [ ] T004 Completar compatibilidad de filas existentes en backend/src/main/resources/db/migration/V2__add_auth_fields_to_empleados.sql; Done: backfill seguro + `NOT NULL` + `UNIQUE(email)` sin romper filas previas; Verify: `grep -n "UPDATE empleados\|NOT NULL\|UNIQUE\|CREATE UNIQUE INDEX" backend/src/main/resources/db/migration/V2__add_auth_fields_to_empleados.sql`
- [ ] T005 [P] Extender entidad con campos auth en backend/src/main/java/com/dsw02/empleados/model/Empleado.java; Done: incluye `email`, `passwordHash`, `role` con constraints JPA; Verify: `grep -n "email\|passwordHash\|role" backend/src/main/java/com/dsw02/empleados/model/Empleado.java`
- [ ] T006 [P] Crear enum de roles en backend/src/main/java/com/dsw02/empleados/model/EmpleadoRole.java; Done: define `ADMIN` y `USER`; Verify: `grep -n "enum EmpleadoRole\|ADMIN\|USER" backend/src/main/java/com/dsw02/empleados/model/EmpleadoRole.java`
- [ ] T007 Actualizar repositorio con búsqueda por email en backend/src/main/java/com/dsw02/empleados/repository/EmpleadoRepository.java; Done: existe `findByEmail`; Verify: `grep -n "findByEmail" backend/src/main/java/com/dsw02/empleados/repository/EmpleadoRepository.java`
- [ ] T008 Validar migración aplicada con stack local en backend/pom.xml y backend/src/main/resources/db/migration/V2__add_auth_fields_to_empleados.sql; Done: app inicia con Flyway sin error; Verify: `docker compose up -d --build && docker compose logs empleados-backend --tail=200 | grep -Ei "Flyway|migrate|Successfully applied"`

**Checkpoint**: Base de datos, entidad y repositorio listos.

---

## Phase 3: User Story 1 - Inicio de sesión con Empleado (Priority: P1) 🎯 MVP

**Goal**: Autenticación Basic contra BD usando `email` + validación BCrypt.

**Independent Test**: `GET /api/v1/empleados` con credenciales válidas -> 200; inválidas -> 401.

### Tests/Evidence for User Story 1

- [ ] T009 [US1] Verificar `401` por credenciales inválidas en specs/003-empleado-db-auth/quickstart.md; Done: comando documentado y respuesta esperada 401; Verify: `curl -i -u user@demo.com:wrongpass "http://localhost:8080/api/v1/empleados?page=0&size=5&sort=clave,asc" | head -n 1`
- [ ] T010 [US1] Verificar login válido por email en specs/003-empleado-db-auth/quickstart.md; Done: comando documentado y respuesta esperada 200; Verify: `curl -i -u user@demo.com:user123 "http://localhost:8080/api/v1/empleados?page=0&size=5&sort=clave,asc" | head -n 1`

### Implementation for User Story 1

- [ ] T011 [US1] Reemplazar usuarios in-memory por autenticación BD en backend/src/main/java/com/dsw02/empleados/config/SecurityConfig.java; Done: sin `InMemoryUserDetailsManager` ni usuarios hardcodeados finales; Verify: `grep -n "InMemoryUserDetailsManager\|User.withUsername\(\"admin\"\|User.withUsername\(\"user\"" backend/src/main/java/com/dsw02/empleados/config/SecurityConfig.java || true`
- [ ] T012 [P] [US1] Implementar `UserDetailsService` basado en email en backend/src/main/java/com/dsw02/empleados/service/EmpleadoUserDetailsService.java; Done: carga empleado por `findByEmail` y mapea roles; Verify: `grep -n "implements UserDetailsService\|findByEmail\|ROLE_" backend/src/main/java/com/dsw02/empleados/service/EmpleadoUserDetailsService.java`
- [ ] T013 [P] [US1] Mantener BCrypt como encoder en backend/src/main/java/com/dsw02/empleados/config/SecurityConfig.java; Done: `PasswordEncoder` usa `BCryptPasswordEncoder`; Verify: `grep -n "BCryptPasswordEncoder" backend/src/main/java/com/dsw02/empleados/config/SecurityConfig.java`
- [ ] T014 [US1] Ajustar DTOs para entrada de credenciales en backend/src/main/java/com/dsw02/empleados/model/EmpleadoCreateRequest.java y backend/src/main/java/com/dsw02/empleados/model/EmpleadoUpdateRequest.java; Done: aceptan `email`, `password`, `role` con validaciones; Verify: `grep -n "email\|password\|role" backend/src/main/java/com/dsw02/empleados/model/EmpleadoCreateRequest.java backend/src/main/java/com/dsw02/empleados/model/EmpleadoUpdateRequest.java`
- [ ] T015 [US1] Persistir `passwordHash` (no password plano) en backend/src/main/java/com/dsw02/empleados/service/EmpleadoService.java y ocultarlo en backend/src/main/java/com/dsw02/empleados/model/EmpleadoResponse.java; Done: hash BCrypt al guardar/actualizar y response sin hash; Verify: `grep -n "passwordHash\|passwordEncoder" backend/src/main/java/com/dsw02/empleados/service/EmpleadoService.java && ! grep -n "passwordHash" backend/src/main/java/com/dsw02/empleados/model/EmpleadoResponse.java`

**Checkpoint**: Autenticación básica contra BD funcionando (MVP).

---

## Phase 4: User Story 2 - Control de permisos por rol (Priority: P2)

**Goal**: `USER` solo lectura y `ADMIN` escritura, manteniendo `/api/v1` y paginación.

**Independent Test**: USER obtiene 200 en GET y 403 en POST/PUT/DELETE; ADMIN obtiene 201/200/204 en CRUD.

### Tests/Evidence for User Story 2

- [ ] T016 [US2] Verificar lectura paginada con USER en specs/003-empleado-db-auth/quickstart.md; Done: evidencia 200 en GET paginado; Verify: `curl -i -u user@demo.com:user123 "http://localhost:8080/api/v1/empleados?page=0&size=5&sort=clave,asc" | head -n 1`
- [ ] T017 [US2] Verificar `403` en escritura con USER en specs/003-empleado-db-auth/quickstart.md; Done: evidencia para POST (extensible a PUT/DELETE); Verify: `curl -i -u user@demo.com:user123 -X POST http://localhost:8080/api/v1/empleados -H 'Content-Type: application/json' -d '{"nombre":"U","direccion":"D","telefono":"T","email":"u403@demo.com","password":"secret123","role":"USER"}' | head -n 1`
- [ ] T018 [US2] Verificar éxito CRUD con ADMIN en specs/003-empleado-db-auth/quickstart.md; Done: evidencia de POST 201 (y rutas PUT/DELETE documentadas); Verify: `curl -i -u admin@demo.com:admin123 -X POST http://localhost:8080/api/v1/empleados -H 'Content-Type: application/json' -d '{"nombre":"A","direccion":"D","telefono":"T","email":"a201@demo.com","password":"secret123","role":"ADMIN"}' | head -n 1`

### Implementation for User Story 2

- [ ] T019 [US2] Aplicar reglas finales de autorización en backend/src/main/java/com/dsw02/empleados/config/SecurityConfig.java; Done: `/api/v1/**` autenticado, `GET` para `ADMIN/USER`, `POST/PUT/DELETE` solo `ADMIN`; Verify: `grep -n "requestMatchers\|/api/v1/\*\*\|HttpMethod.GET\|HttpMethod.POST\|HttpMethod.PUT\|HttpMethod.DELETE\|hasAnyRole\|hasRole" backend/src/main/java/com/dsw02/empleados/config/SecurityConfig.java`
- [ ] T020 [US2] Mantener rutas versionadas y paginación sin regresión en backend/src/main/java/com/dsw02/empleados/controller/EmpleadoController.java y backend/src/main/java/com/dsw02/empleados/service/EmpleadoService.java; Done: endpoint sigue en `/api/v1/empleados` y devuelve `Page`; Verify: `grep -n "@RequestMapping(\"/api/v1/empleados\"\)|Page<EmpleadoResponse>|Pageable" backend/src/main/java/com/dsw02/empleados/controller/EmpleadoController.java backend/src/main/java/com/dsw02/empleados/service/EmpleadoService.java`
- [ ] T021 [P] [US2] Sincronizar seguridad y campos en specs/003-empleado-db-auth/contracts/openapi.yaml; Done: contratos reflejan roles y payload auth actuales; Verify: `grep -n "basicAuth\|ADMIN\|USER\|email\|password\|/api/v1/empleados" specs/003-empleado-db-auth/contracts/openapi.yaml`

**Checkpoint**: Permisos por rol y compatibilidad de contrato listos.

---

## Phase 5: User Story 3 - Seed inicial y operación Docker (Priority: P3)

**Goal**: Tener usuarios seed reproducibles y entorno Docker verificable.

**Independent Test**: Con tabla vacía, arranque crea seeds; `/actuator/health` 200 sin auth; login seed funciona.

### Tests/Evidence for User Story 3

- [ ] T022 [US3] Verificar `/actuator/health` público en specs/003-empleado-db-auth/quickstart.md; Done: evidencia de 200 sin auth; Verify: `curl -i http://localhost:8080/actuator/health | head -n 1`
- [ ] T023 [US3] Verificar existencia de seed por autenticación GET en specs/003-empleado-db-auth/quickstart.md; Done: `user@demo.com` accede a GET paginado con 200; Verify: `curl -i -u user@demo.com:user123 "http://localhost:8080/api/v1/empleados?page=0&size=5&sort=clave,asc" | head -n 1`

### Implementation for User Story 3

- [ ] T024 [US3] Crear inicializador idempotente en backend/src/main/java/com/dsw02/empleados/config/EmpleadoSeedInitializer.java; Done: crea `admin@demo.com` y `user@demo.com` solo si `empleados` está vacía; Verify: `grep -n "admin@demo.com\|user@demo.com\|count\|if" backend/src/main/java/com/dsw02/empleados/config/EmpleadoSeedInitializer.java`
- [ ] T025 [US3] Aplicar hash BCrypt en seed en backend/src/main/java/com/dsw02/empleados/config/EmpleadoSeedInitializer.java; Done: no persiste passwords en claro; Verify: `grep -n "passwordEncoder.encode" backend/src/main/java/com/dsw02/empleados/config/EmpleadoSeedInitializer.java`
- [ ] T026 [US3] Mantener accesibles Swagger y healthcheck en backend/src/main/java/com/dsw02/empleados/config/SecurityConfig.java y backend/src/main/java/com/dsw02/empleados/config/OpenApiConfig.java; Done: `/swagger-ui/**`, `/v3/api-docs/**`, `/actuator/health` permitAll y OpenAPI con `basicAuth`; Verify: `grep -n "swagger-ui\|v3/api-docs\|actuator/health\|permitAll\|basicAuth" backend/src/main/java/com/dsw02/empleados/config/SecurityConfig.java backend/src/main/java/com/dsw02/empleados/config/OpenApiConfig.java`

**Checkpoint**: Seed y operación Docker con evidencias completas.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cierre verificable del feature sin expandir alcance.

- [ ] T027 [P] Ejecutar validación integrada de arranque en docker-compose.yml y specs/003-empleado-db-auth/quickstart.md; Done: contenedores `healthy`; Verify: `docker compose up -d --build && docker compose ps`
- [ ] T028 Ejecutar batería mínima de evidencias de seguridad en specs/003-empleado-db-auth/quickstart.md; Done: 200/401/403/201 verificados; Verify: `bash -lc 'curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/actuator/health && curl -s -o /dev/null -w "%{http_code}\n" -u user@demo.com:user123 "http://localhost:8080/api/v1/empleados?page=0&size=5&sort=clave,asc" && curl -s -o /dev/null -w "%{http_code}\n" -u user@demo.com:badpass "http://localhost:8080/api/v1/empleados?page=0&size=5&sort=clave,asc"'`
- [ ] T029 Validar no regresión de versionado/paginación en backend/src/main/java/com/dsw02/empleados/controller/EmpleadoController.java y specs/003-empleado-db-auth/quickstart.md; Done: `/api/v1` y `page,size,sort` siguen operativos; Verify: `grep -n "@RequestMapping(\"/api/v1/empleados\"\)|@RequestParam(defaultValue = \"0\")|@RequestParam(defaultValue = \"10\")|@RequestParam(defaultValue = \"clave,asc\")" backend/src/main/java/com/dsw02/empleados/controller/EmpleadoController.java`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: inicia de inmediato.
- **Foundational (Phase 2)**: depende de Setup; bloquea US1/US2/US3.
- **US1 (Phase 3)**: depende de Foundational; habilita autenticación real MVP.
- **US2 (Phase 4)**: depende de US1 para reutilizar identidad autenticada.
- **US3 (Phase 5)**: depende de US1 (encoder + user details) y de migración ya aplicada.
- **Polish (Phase 6)**: depende de todas las historias.

### User Story Dependencies

- **US1 (P1)**: independiente respecto a otras historias tras base técnica.
- **US2 (P2)**: se apoya en autenticación de US1, pero valida permisos de forma aislada.
- **US3 (P3)**: usa base de seguridad/BD para sembrado y smoke tests Docker.

### Within Each User Story

- Primero tareas de evidencia/criterio de prueba.
- Luego implementación en código.
- Luego sincronización de contrato/documentación.

### Parallel Opportunities

- T002 con T001.
- T005 y T006 en paralelo tras T004.
- T012 y T013 en paralelo tras T011.
- T021 en paralelo con T020.
- T022 y T023 en paralelo tras T024/T025.
- T027 en paralelo con revisión documental final.

---

## Parallel Example: User Story 1

```bash
# Después de T011:
# Ejecutar en paralelo tareas de implementación desacopladas
Task: "T012 [US1] Implementar EmpleadoUserDetailsService en backend/src/main/java/com/dsw02/empleados/service/EmpleadoUserDetailsService.java"
Task: "T013 [US1] Confirmar BCrypt encoder en backend/src/main/java/com/dsw02/empleados/config/SecurityConfig.java"
```

---

## Implementation Strategy

### MVP First (US1)

1. Completar Setup + Foundational.
2. Completar US1 (autenticación BD + BCrypt).
3. Validar 200/401 con comandos de evidencia.

### Incremental Delivery

1. US1: autenticación real contra BD.
2. US2: reglas de autorización por rol sin romper `/api/v1` ni paginación.
3. US3: seed idempotente y smoke tests Docker.
4. Polish: consolidación de evidencias.

### Minimal-Change Guardrails

- No crear nuevos módulos/proyectos.
- No cambiar rutas de negocio existentes fuera de `/api/v1/empleados`.
- No sustituir Basic Auth por JWT en este alcance.
- Mantener `docker-compose.yml` con 2 contenedores.
