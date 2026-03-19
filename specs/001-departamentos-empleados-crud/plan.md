# Implementation Plan: CRUD Departamentos y Empleados

**Branch**: `001-departamentos-empleados-crud` | **Date**: 2026-03-12 | **Spec**: `specs/001-departamentos-empleados-crud/spec.md`  
**Input**: Feature specification from `specs/001-departamentos-empleados-crud/spec.md`

## Summary

Agregar el recurso `Departamento` y su relacion opcional con `Empleado` usando cambios minimos e incrementales sobre la arquitectura actual.  
El orden de implementacion sera: **Flyway -> entidad/repositorio -> servicio -> controller -> validaciones 400/409 -> OpenAPI/Swagger -> pruebas**.

Se preservan sin regresion:
- Rutas de negocio bajo `/api/v1`
- Basic Auth contra BD (`Empleado`) y roles (`GET` para `USER/ADMIN`, escritura solo `ADMIN`)
- `/actuator/health` publico (`permitAll`)
- Swagger/OpenAPI con `Authorize` (`basicAuth`)
- `docker compose` con 2 contenedores (`backend` + `postgres`) y healthchecks

## Technical Context

**Language/Version**: Java 17  
**Primary Dependencies**: Spring Boot 3.3.x (Web, Data JPA, Security, Validation, Actuator), Flyway, springdoc-openapi  
**Storage**: PostgreSQL  
**Testing**: Validacion manual con `curl`, smoke tests de Docker Compose y compilacion Maven  
**Target Platform**: Linux + Docker local  
**Project Type**: Backend REST service  
**Performance Goals**: Mantener comportamiento actual y latencia equivalente en CRUD existente  
**Constraints**: Cambios minimos; no reestructurar paquetes; mantener contratos existentes de empleados fuera del alcance necesario (`departamentoClave`)  
**Scale/Scope**: Un solo backend con recursos `empleados` y `departamentos`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Stack gate: PASS (Spring Boot 3 + Java 17).
- API versioning gate: PASS (`/api/v1/**` para endpoints de negocio).
- Security gate: PASS (Basic Auth sobre BD, sin usuarios in-memory).
- Identity source gate: PASS (persistido en `Empleado`).
- Authorization gate: PASS (`GET` para `USER/ADMIN`, escritura solo `ADMIN`).
- Data gate: PASS (PostgreSQL + Flyway).
- Runtime gate: PASS (2 contenedores + healthchecks + `/actuator/health` publico).
- Documentation gate: PASS (Swagger/OpenAPI con `basicAuth`).
- Pagination gate: PASS (paginacion obligatoria para listados; se extiende a departamentos).

Pre-Phase 0 status: PASS.

## Project Structure

### Documentation (this feature)

```text
specs/001-departamentos-empleados-crud/
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
└── src/main/resources/
    └── db/migration/

docker-compose.yml
```

**Structure Decision**: Se mantiene la estructura monolitica actual y se agregan solo clases/archivos necesarios para `Departamento` y su relacion opcional con `Empleado`.

## Planned File Touch List (Implementation)

### Create

- `backend/src/main/resources/db/migration/V3__create_departamentos_and_empleado_fk.sql`
- `backend/src/main/java/com/dsw02/empleados/model/Departamento.java`
- `backend/src/main/java/com/dsw02/empleados/model/DepartamentoCreateRequest.java`
- `backend/src/main/java/com/dsw02/empleados/model/DepartamentoUpdateRequest.java`
- `backend/src/main/java/com/dsw02/empleados/model/DepartamentoResponse.java`
- `backend/src/main/java/com/dsw02/empleados/repository/DepartamentoRepository.java`
- `backend/src/main/java/com/dsw02/empleados/service/DepartamentoService.java`
- `backend/src/main/java/com/dsw02/empleados/controller/DepartamentoController.java`

### Modify

- `backend/src/main/java/com/dsw02/empleados/model/Empleado.java`
- `backend/src/main/java/com/dsw02/empleados/model/EmpleadoCreateRequest.java`
- `backend/src/main/java/com/dsw02/empleados/model/EmpleadoUpdateRequest.java`
- `backend/src/main/java/com/dsw02/empleados/model/EmpleadoResponse.java`
- `backend/src/main/java/com/dsw02/empleados/repository/EmpleadoRepository.java`
- `backend/src/main/java/com/dsw02/empleados/service/EmpleadoService.java`
- `backend/src/main/java/com/dsw02/empleados/service/EmpleadoValidationService.java`
- `backend/src/main/java/com/dsw02/empleados/config/SecurityConfig.java` (solo si requiere matcher explicito para departamentos)
- `backend/src/main/java/com/dsw02/empleados/config/OpenApiConfig.java` (si se documenta localmente ademas del contrato)
- `specs/001-departamentos-empleados-crud/contracts/openapi.yaml`
- `specs/001-departamentos-empleados-crud/quickstart.md`

## Implementation Order (Incremental)

1. **Flyway**
- Crear tabla `departamentos` (`clave` PK varchar(16), `nombre` varchar(100)).
- Agregar columna nullable `departamento_clave` en `empleados`.
- Agregar FK de `empleados.departamento_clave -> departamentos.clave`.

2. **Entidad/Repositorio**
- Mapear `Departamento` y relacion opcional en `Empleado`.
- Crear `DepartamentoRepository` y metodos de existencia/uso para reglas de borrado.

3. **Servicio**
- Implementar CRUD de departamentos con paginacion y validaciones.
- Resolver asignacion de `departamentoClave` en create/update de empleado.

4. **Controller**
- Exponer `/api/v1/departamentos` con GET list/detail, POST, PUT, DELETE.
- Mantener convenciones de respuesta y errores del API actual.

5. **Validaciones 400/409**
- `page`, `size`, `sort` invalidos -> `400`.
- `departamentoClave` inexistente en empleado -> `400` con JSON estandar.
- `DELETE` departamento con empleados asociados -> `409` con JSON estandar.

6. **OpenAPI/Swagger**
- Actualizar contrato del feature con endpoints/schemas de departamentos y extension de empleado.
- Mantener `basicAuth` y requerimientos de seguridad.

7. **Pruebas y validacion operativa**
- Compilacion: `mvn -DskipTests compile`.
- `docker compose up -d --build` + healthchecks.
- Evidencia de seguridad por rol y flujos 400/409/204.

## Risks & Mitigation

1. **FK departamento en empleados puede bloquear eliminaciones o migracion**
- Riesgo: inconsistencias referenciales o datos invalidos durante asignacion.
- Mitigacion: columna nullable + FK controlada + validacion previa por servicio.

2. **Regla 409 en delete puede romper semantica esperada por clientes**
- Riesgo: clientes esperaban borrado directo.
- Mitigacion: mensaje de error explicito y contrato OpenAPI actualizado.

3. **No romper empleados existentes**
- Riesgo: regresion en endpoints/DTO actuales por agregar `departamentoClave`.
- Mitigacion: cambios compatibles hacia atras (campo opcional) y smoke tests de CRUD empleados.

4. **Paginacion de departamentos inconsistente**
- Riesgo: divergencia respecto a reglas actuales de empleados.
- Mitigacion: reutilizar validaciones y formato de respuesta paginada existente.

5. **Regresion de seguridad al agregar nuevo recurso**
- Riesgo: endpoints de departamentos sin proteccion correcta.
- Mitigacion: matcher de seguridad por metodo alineado con reglas actuales y validacion con `USER/ADMIN`.

## Post-Design Constitution Check

- Stack gate: PASS.
- API versioning gate: PASS.
- Security gate: PASS.
- Identity source gate: PASS.
- Authorization gate: PASS.
- Data gate: PASS.
- Runtime gate: PASS.
- Documentation gate: PASS.
- Pagination gate: PASS.

Post-Phase 1 status: PASS.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
