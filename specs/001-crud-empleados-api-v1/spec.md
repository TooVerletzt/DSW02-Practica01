# Feature Specification: CRUD de Empleados API v1

**Feature Branch**: `001-crud-empleados-api-v1`  
**Created**: 2026-03-05  
**Status**: Ready  
**Input**: User description: "Actualiza la especificación del CRUD de empleados con versionado /api/v1, paginación en GET listado y reglas de autenticación/autorización para escritura."

## Clarifications

### Session 2026-03-05

- Q: ¿`/actuator/health` debe requerir autenticación en este alcance? → A: No,
  se mantiene público (`permitAll`).

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Versionado consistente de rutas (Priority: P1)

Como consumidor de la API, quiero que todas las rutas funcionales del CRUD usen
el prefijo `/api/v1` para tener un contrato uniforme y sin ambigüedad.

**Why this priority**: Sin versionado consistente, el contrato público queda
fragmentado y aumenta el riesgo de integraciones incompatibles.

**Independent Test**: Se valida consumiendo las operaciones del CRUD bajo
`/api/v1/empleados` y comprobando que no existen rutas funcionales equivalentes
sin ese prefijo.

**Acceptance Scenarios**:

1. **Given** que el servicio está disponible, **When** un cliente consulta la
  documentación de la API, **Then** las rutas del CRUD de empleados aparecen
  bajo `/api/v1/empleados`.
2. **Given** que un cliente intenta usar una ruta funcional sin prefijo
  versionado, **When** realiza la solicitud, **Then** la operación no se
  atiende como endpoint de negocio válido del CRUD.

---

### User Story 2 - Listado paginado de empleados (Priority: P2)

Como usuario consumidor del listado, quiero consultar empleados con paginación
para navegar resultados grandes sin respuestas masivas.

**Why this priority**: El listado paginado mejora escalabilidad funcional y
experiencia de consumo del endpoint.

**Independent Test**: Se valida invocando `GET /api/v1/empleados` con y sin
parámetros `page`, `size` y `sort`, verificando contenido y metadatos de
paginado en la respuesta.

**Acceptance Scenarios**:

1. **Given** que existen empleados registrados, **When** un cliente invoca
  `GET /api/v1/empleados` sin parámetros, **Then** el sistema aplica
  `page=0`, `size=10`, `sort=clave,asc` y devuelve respuesta paginada.
2. **Given** que existen empleados registrados, **When** un cliente invoca
  `GET /api/v1/empleados?page=1&size=5&sort=clave,desc`, **Then** el sistema
  devuelve la página solicitada y los metadatos `totalElements`, `totalPages`,
  `number` y `size` coherentes con el resultado.
3. **Given** una solicitud con `page` menor a 0, **When** el cliente invoca
  `GET /api/v1/empleados`, **Then** el sistema responde `400` con el formato
  de error estándar del API.
4. **Given** una solicitud con `size` menor a 1 o mayor a 100, **When** el
  cliente invoca `GET /api/v1/empleados`, **Then** el sistema responde `400`
  con el formato de error estándar del API.
5. **Given** una solicitud con `sort` inválido, **When** el cliente invoca
  `GET /api/v1/empleados`, **Then** el sistema responde `400` con el formato
  de error estándar del API.

---

### User Story 3 - Seguridad por rol en escritura (Priority: P3)

Como responsable del sistema, quiero que las operaciones de escritura estén
restringidas a `ADMIN` con Basic Auth para proteger modificaciones de datos.

**Why this priority**: Evita cambios no autorizados en altas, actualizaciones
y eliminaciones.

**Independent Test**: Se valida autenticando con `admin/admin123` y comparando
comportamiento de `POST/PUT/DELETE` frente a solicitudes sin credenciales o sin
rol `ADMIN`.

**Acceptance Scenarios**:

1. **Given** que un usuario autenticado con `admin/admin123` realiza una
  operación de escritura, **When** envía `POST`, `PUT` o `DELETE` válido,
  **Then** la operación se procesa según reglas del CRUD.
2. **Given** que una solicitud de escritura no está autenticada o no tiene rol
  `ADMIN`, **When** ejecuta `POST`, `PUT` o `DELETE`, **Then** el sistema la
  rechaza por autorización/autenticación.
3. **Given** que un usuario autenticado con rol `USER` realiza una operación de
  lectura, **When** invoca `GET /api/v1/empleados` o
  `GET /api/v1/empleados/{clave}`, **Then** el sistema permite la consulta.

---

### Edge Cases

- Solicitud de listado con `size` igual a 0 o negativo.
- Solicitud de listado con `size` mayor a 100.
- Solicitud de listado con `page` negativo.
- Solicitud con `sort` en formato inválido (por ejemplo campo vacío o dirección no válida).
- Solicitud de escritura autenticada con credenciales distintas de `admin/admin123`.
- Solicitud `GET` autenticada con usuario sin rol esperado para lectura.
- Solicitudes a rutas no versionadas del CRUD (`/empleados`) tras la migración a `/api/v1/empleados`.
- Verificación de que rutas técnicas permitidas (`/swagger-ui/**`, `/v3/api-docs/**`, `/actuator/**`) se mantienen fuera de `/api/v1`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST exponer todos los endpoints de negocio del CRUD
  de empleados bajo el prefijo único `/api/v1`.
- **FR-002**: El sistema MUST definir el recurso de empleados en la ruta base
  `/api/v1/empleados` para operaciones de listado y alta, y en
  `/api/v1/empleados/{clave}` para consulta puntual, actualización y eliminación.
- **FR-003**: El sistema MUST no publicar endpoints funcionales del CRUD de
  empleados fuera de `/api/v1`, exceptuando únicamente rutas técnicas
  `/swagger-ui/**`, `/v3/api-docs/**` y `/actuator/**`.
- **FR-004**: El endpoint `GET /api/v1/empleados` MUST aceptar parámetros de
  paginación `page`, `size` y `sort`.
- **FR-005**: En ausencia de parámetros, `GET /api/v1/empleados` MUST aplicar
  por defecto `page=0`, `size=10`, `sort=clave,asc`.
- **FR-006**: El parámetro `sort` MUST aceptar dirección ascendente o
  descendente, al menos para el campo `clave`.
- **FR-007**: La respuesta de `GET /api/v1/empleados` MUST ser paginada y MUST
  incluir `content`, `totalElements`, `totalPages`, `number` y `size`.
- **FR-007A**: Cuando `page < 0`, `size < 1`, `size > 100` o `sort` sea
  inválido, `GET /api/v1/empleados` MUST responder con `400 Bad Request`.
- **FR-007B**: Las respuestas `400` por parámetros de paginación inválidos MUST
  usar el formato de error estándar ya definido por la API mediante
  `ApiExceptionHandler` (campos `timestamp`, `status`, `error`, `message`,
  `path` o equivalente vigente en el handler).
- **FR-008**: El sistema MUST mantener autenticación HTTP Basic para las
  operaciones del CRUD bajo `/api/v1/**`.
- **FR-009**: El usuario administrativo de prueba MUST ser fijo como
  `admin/admin123`.
- **FR-009A**: El usuario de solo lectura MUST ser `user/user123` con rol
  `USER` para escenarios de consulta autenticada.
- **FR-010**: Las operaciones de escritura `POST`, `PUT` y `DELETE` MUST estar
  restringidas a solicitudes autenticadas con rol `ADMIN`.
- **FR-011**: La documentación Swagger/OpenAPI MUST reflejar rutas bajo
  `/api/v1` y MUST permitir autorización por `basicAuth` en Swagger UI.
- **FR-012**: Para este alcance, las operaciones de lectura `GET`
  (`/api/v1/empleados` y `/api/v1/empleados/{clave}`) MUST permanecer
  protegidas por autenticación básica y permitir acceso a roles `ADMIN` y
  `USER`.
- **FR-013**: Swagger UI (`/swagger-ui/**`) y documentos OpenAPI
  (`/v3/api-docs/**`) MUST permanecer accesibles para exploración de API.
- **FR-014**: El endpoint técnico `/actuator/health` MUST permanecer accesible
  sin autenticación en este alcance.

### Key Entities *(include if feature involves data)*

- **Empleado**: Registro de negocio con identificador `clave` y datos
  `nombre`, `dirección`, `teléfono`.
- **SolicitudListadoPaginado**: Parámetros de consulta del listado compuestos
  por `page`, `size` y `sort`.
- **PáginaEmpleados**: Estructura de salida para listado paginado con
  `content`, `totalElements`, `totalPages`, `number` y `size`.

## Assumptions

- Se mantiene la semántica actual del CRUD fuera de versionado y paginación.
- La decisión de acceso para lectura en este incremento es `GET` protegido.
- El usuario de lectura para pruebas es `user/user123` con rol `USER`.
- El orden por defecto del listado es por `clave` ascendente.
- Los endpoints técnicos (`/swagger-ui/**`, `/v3/api-docs/**`, `/actuator/**`)
  permanecen disponibles fuera del prefijo `/api/v1`.
- `actuator/health` se mantiene público en este alcance.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de endpoints funcionales del CRUD quedan accesibles bajo
  `/api/v1/empleados` y no existen rutas funcionales equivalentes sin prefijo.
- **SC-002**: El 100% de respuestas de `GET /api/v1/empleados` incluyen los
  metadatos `totalElements`, `totalPages`, `number` y `size`.
- **SC-003**: El 100% de solicitudes de escritura sin autenticación o sin rol
  `ADMIN` son rechazadas.
- **SC-004**: El 100% de operaciones de escritura ejecutadas con
  `admin/admin123` y payload válido se completan según el comportamiento
  existente del CRUD.
