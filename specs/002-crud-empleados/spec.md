# Feature Specification: CRUD de Empleados

**Feature Branch**: `002-crud-empleados`  
**Created**: 2026-02-25  
**Status**: Draft  
**Input**: User description: "Crea un crud de empleados con los campos clave, nombre, dirección y teléfono. Donde clave sea el PK y nombre, dirección y teléfono sea de 100 caracteres."

## Clarifications

### Session 2026-02-25

- Q: ¿La eliminación de empleados debe ser física o lógica? → A: Borrado físico.
- Q: ¿Qué validación funcional aplica al teléfono además de longitud? → A: Solo
  longitud máxima.
- Q: ¿Cómo debe comportarse el listado de empleados respecto a paginación? → A:
  Sin paginación.
- Q: ¿Cuál es el formato y regla de unicidad de `clave`? → A: `clave`
  autogenerada con prefijo `EMP-` y consecutivo numérico único.
- Q: ¿Qué pasa si se intenta actualizar un empleado inexistente? → A:
  Responder `404 Not Found`.
- Q: ¿Cuál es la política de acceso al CRUD en esta versión? → A:
  Autenticación obligatoria y rol `admin` para todas las operaciones.
- Q: ¿Cómo se manejan espacios al inicio/fin en campos de texto? → A:
  Recortar espacios antes de validar y guardar.
- Q: ¿La `clave` compuesta (`EMP-` + consecutivo) es lógica o también física en
  persistencia? → A: Compuesta lógica para negocio; físicamente se persiste como
  un único valor `clave` (`VARCHAR`) con formato `EMP-<número>`.
- Q: ¿Qué código HTTP aplica para fallos de acceso? → A: `401` si no hay
  autenticación y `403` si el usuario autenticado no tiene rol `admin`.

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

### User Story 1 - Registrar empleados (Priority: P1)

Como usuario administrador, quiero registrar un empleado con nombre, dirección
y teléfono para que el sistema asigne automáticamente su clave.

**Why this priority**: Sin alta de empleados no existe base de datos funcional
para ninguna otra operación del módulo.

**Independent Test**: Se valida al crear un empleado nuevo con datos válidos y
confirmar que queda disponible para consulta posterior.

**Acceptance Scenarios**:

1. **Given** que existe disponibilidad para registrar empleados, **When** el
  usuario registra un empleado con nombre, dirección y teléfono válidos,
  **Then** el sistema genera la clave con formato `EMP-<número>`, guarda el
  empleado y confirma el alta exitosa.
2. **Given** que se registran dos empleados válidos de forma consecutiva,
  **When** se completan ambas altas, **Then** cada empleado recibe una clave
  distinta con prefijo `EMP-` y consecutivo numérico incremental.

---

### User Story 2 - Consultar y actualizar empleados (Priority: P2)

Como usuario administrador, quiero consultar empleados existentes y actualizar
sus datos para mantener la información vigente.

**Why this priority**: La consulta y actualización permiten operación diaria
sobre registros ya creados.

**Independent Test**: Se valida al recuperar un empleado existente por clave y
modificar al menos uno de sus campos de texto manteniendo las restricciones.

**Acceptance Scenarios**:

1. **Given** que existe un empleado registrado, **When** el usuario consulta por
  clave o lista empleados, **Then** el sistema devuelve los datos completos del
  empleado o el conjunto solicitado.
2. **Given** que existe un empleado registrado, **When** el usuario actualiza
  nombre, dirección o teléfono con valores válidos, **Then** el sistema guarda
  los cambios y devuelve la versión actualizada.

---

### User Story 3 - Eliminar empleados (Priority: P3)

Como usuario administrador, quiero eliminar empleados para depurar registros
obsoletos o incorrectos.

**Why this priority**: El borrado completa el ciclo CRUD pero tiene menor
prioridad que alta y mantenimiento de datos.

**Independent Test**: Se valida eliminando un empleado existente y comprobando
que deja de estar disponible en búsquedas posteriores.

**Acceptance Scenarios**:

1. **Given** que existe un empleado registrado, **When** el usuario solicita su
  eliminación por clave, **Then** el sistema elimina el registro y confirma la
  operación.
2. **Given** que no existe un empleado con la clave indicada, **When** el
  usuario intenta eliminarlo, **Then** el sistema responde que no se encontró
  el recurso.

---

### Edge Cases

- Intento de alta o actualización con `nombre` mayor a 100 caracteres.
- Intento de alta o actualización con `dirección` mayor a 100 caracteres.
- Intento de alta o actualización con `teléfono` mayor a 100 caracteres.
- Teléfono con caracteres no numéricos dentro del límite de longitud.
- Intento de alta incluyendo manualmente un valor para `clave`.
- Solicitud con `clave` vacía o nula en consulta, actualización o eliminación.
- Solicitud con `clave` que no cumple el formato `EMP-<número>`.
- Consulta de empleado por clave inexistente.
- Actualización de empleado por `clave` inexistente.
- Registro o actualización con espacios al inicio/fin en campos de texto
  (deben recortarse antes de validar y persistir).
- Intento de acceso al CRUD sin autenticación o sin rol `admin`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir crear un empleado con los campos:
  `nombre`, `dirección` y `teléfono`.
- **FR-002**: `clave` MUST ser única y actuar como identificador principal de
  cada empleado.
- **FR-002A**: `clave` MUST generarse automáticamente al dar de alta un
  empleado y MUST usar el formato `EMP-<número>`.
- **FR-002B**: La clave lógica del empleado MUST tratarse como identificador
  compuesto por prefijo fijo `EMP-` y consecutivo numérico incremental.
- **FR-002C**: En persistencia, la `clave` MUST almacenarse como un único campo
  de texto con formato `EMP-<número>`; la composición prefijo+consecutivo se
  considera una regla lógica de negocio.
- **FR-003**: `nombre` MUST aceptar hasta 100 caracteres.
- **FR-004**: `dirección` MUST aceptar hasta 100 caracteres.
- **FR-005**: `teléfono` MUST aceptar hasta 100 caracteres.
- **FR-005A**: `teléfono` MUST validarse solo por longitud máxima de 100
  caracteres, sin restricción de patrón.
- **FR-006**: El sistema MUST permitir consultar un empleado por `clave`.
- **FR-007**: El sistema MUST permitir listar los empleados registrados.
- **FR-007A**: El listado de empleados MUST devolverse sin paginación en esta
  versión del alcance.
- **FR-008**: El sistema MUST permitir actualizar `nombre`, `dirección` y
  `teléfono` de un empleado existente.
- **FR-008A**: El sistema MUST rechazar la actualización de un empleado
  inexistente con respuesta de recurso no encontrado (`404 Not Found`).
- **FR-009**: El sistema MUST permitir eliminar un empleado por `clave` con
  borrado físico definitivo del registro.
- **FR-010**: El sistema MUST rechazar operaciones de creación o actualización
  que incumplan generación automática de `clave` o longitud máxima de campos.
- **FR-010A**: El sistema MUST validar que la `clave` usada en consulta,
  actualización y eliminación cumpla el formato `EMP-<número>`.
- **FR-011**: El sistema MUST requerir autenticación para todas las operaciones
  del CRUD de empleados.
- **FR-012**: El sistema MUST autorizar únicamente usuarios con rol `admin`
  para ejecutar operaciones de alta, consulta, listado, actualización y
  eliminación.
- **FR-012A**: El sistema MUST responder `401 Unauthorized` cuando la solicitud
  no esté autenticada y `403 Forbidden` cuando esté autenticada pero sin rol
  `admin`.
- **FR-013**: El sistema MUST recortar espacios al inicio y al final en
  `nombre`, `dirección` y `teléfono` antes de aplicar validaciones y antes de
  persistir los datos.

### Key Entities *(include if feature involves data)*

- **Empleado**: Representa a una persona registrada para gestión interna.
  Atributos clave: `clave` (identificador principal visible), `prefijo`
  (componente fijo `EMP-`), `consecutivo` (componente numérico incremental),
  `nombre`, `dirección`, `teléfono`.

## Assumptions

- El CRUD será operado por usuarios autorizados con rol administrativo.
- No se requiere carga masiva; las operaciones son unitarias por solicitud.
- El listado de empleados se consume completo (sin paginación).
- La `clave` es autogenerada por el sistema y no editable por el usuario.
- La numeración de la clave no se reutiliza tras eliminaciones.
- La regla de 100 caracteres aplica al valor completo recibido para `nombre`,
  `dirección` y `teléfono`.
- Las solicitudes no autenticadas o sin rol `admin` se rechazan.
- Los campos `nombre`, `dirección` y `teléfono` se normalizan recortando
  espacios al inicio/fin.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de altas válidas de empleados se completa con confirmación
  de éxito en una sola operación y con generación de clave `EMP-<número>`.
- **SC-002**: El 100% de intentos con `nombre`, `dirección` o `teléfono` por
  encima de 100 caracteres es rechazado con mensaje de validación claro.
- **SC-003**: El 100% de claves generadas en altas exitosas es único y no
  presenta duplicados.
- **SC-004**: El 100% de operaciones de actualización y eliminación sobre
  empleados existentes refleja el cambio en la siguiente consulta.
- **SC-005**: El 100% de eliminaciones exitosas no devuelve el empleado en
  consultas posteriores y no conserva registro activo del mismo.
