# Phase 0 Research - CRUD de Empleados API v1

## Decision 1: Versionado por prefijo de controlador
- Decision: Migrar rutas desde `/empleados` a `/api/v1/empleados` cambiando el `@RequestMapping` base del controlador.
- Rationale: Es el cambio mínimo y centralizado para cumplir el prefijo obligatorio sin reestructurar proyecto.
- Alternatives considered: Duplicar rutas v0+v1 temporalmente (rechazado: aumenta mantenimiento y ambigüedad contractual).

## Decision 2: Seguridad por método HTTP
- Decision: Mantener Basic Auth e implementar autorización por método: `GET` autenticado para `ADMIN` o `USER`; `POST/PUT/DELETE` solo `ADMIN`.
- Rationale: Cumple el clarify acordado y evita exponer datos públicos.
- Alternatives considered: Restringir todo a `ADMIN` (rechazado: contradice requerimiento de lectura por `USER`).

## Decision 3: Usuarios de prueba en memoria
- Decision: Conservar usuario `admin/admin123` con rol `ADMIN` y declarar `user/user123` con rol `USER` para lectura.
- Rationale: Reutiliza patrón actual de seguridad sin introducir proveedor externo.
- Alternatives considered: Mover usuarios a DB o variables (rechazado: fuera de alcance incremental).

## Decision 4: Paginación Spring Data Pageable
- Decision: Implementar listado con `Pageable` (`page`, `size`, `sort`) y devolver `Page<EmpleadoResponse>`.
- Rationale: Spring Data provee metadatos (`totalElements`, `totalPages`, `number`, `size`, `content`) de forma estándar y mínima en cambios.
- Alternatives considered: DTO paginado manual (rechazado: complejidad innecesaria y riesgo de inconsistencias).

## Decision 5: Defaults de paginación
- Decision: Aplicar defaults `page=0`, `size=10`, `sort=clave,asc` en endpoint de listado.
- Rationale: Alinea contrato funcional y estabiliza comportamiento sin parámetros.
- Alternatives considered: Defaults globales vía configuración genérica (rechazado: menor claridad local para el endpoint objetivo).

## Decision 6: Swagger y healthcheck operativo
- Decision: Mantener Swagger (`/swagger-ui/**`, `/v3/api-docs/**`) accesible sin auth y con esquema `basicAuth`; mantener `/actuator/health` público.
- Rationale: Permite exploración de contrato y healthchecks de Docker Compose sin credenciales en comandos de sonda.
- Alternatives considered: Proteger `/actuator/health` (rechazado: rompe criterio de operación acordado para healthchecks).

## Decision 7: Validación final enfocada en smoke tests
- Decision: Validar con pruebas manuales/curl de rutas versionadas, permisos por rol, respuesta paginada y health endpoint UP.
- Rationale: Cobertura suficiente para alcance incremental sin introducir nueva infraestructura de pruebas.
- Alternatives considered: Suite completa de integración automatizada (rechazado: fuera de alcance mínimo solicitado).
