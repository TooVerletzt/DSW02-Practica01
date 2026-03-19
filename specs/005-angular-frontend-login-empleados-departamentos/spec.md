# Feature Specification: Frontend Angular Empleados y Departamentos

**Feature Branch**: `001-angular-frontend-crud`  
**Created**: 2026-03-19  
**Status**: Draft  
**Input**: User description: "Construir frontend Angular 22 LTS para login, navegación protegida y CRUD de empleados/departamentos consumiendo backend Spring Boot existente con roles ADMIN/USER"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Login y Navegacion Protegida (Priority: P1)

Como usuario del sistema, quiero iniciar sesion y acceder solo a secciones autorizadas para operar de forma segura.

**Why this priority**: Sin autenticacion y navegacion protegida no es viable usar ninguna capacidad funcional del frontend.

**Independent Test**: Se valida iniciando sesion con credenciales validas e invalidas, verificando redireccion a zona protegida y bloqueo de rutas sin sesion.

**Acceptance Scenarios**:

1. **Given** un usuario sin sesion, **When** intenta abrir una ruta protegida, **Then** el sistema lo redirige a login.
2. **Given** un usuario con credenciales validas en backend, **When** inicia sesion, **Then** accede a la navegacion principal protegida.
3. **Given** un usuario con credenciales invalidas, **When** intenta iniciar sesion, **Then** recibe mensaje de error claro y permanece en login.
4. **Given** un usuario autenticado, **When** ejecuta logout, **Then** se cierra sesion y pierde acceso a rutas protegidas.

---

### User Story 2 - Consulta y CRUD de Empleados por Rol (Priority: P2)

Como usuario autenticado, quiero consultar empleados y, si soy ADMIN, gestionarlos con operaciones de alta, edicion y baja.

**Why this priority**: La gestion de empleados es capacidad central existente en backend y debe estar disponible en frontend con reglas de rol consistentes.

**Independent Test**: Se valida listado para USER y ADMIN, y que solo ADMIN pueda ver/usar acciones de crear, editar y eliminar.

**Acceptance Scenarios**:

1. **Given** un usuario `USER` autenticado, **When** accede a empleados, **Then** puede listar y consultar pero no ve acciones de crear, editar o eliminar.
2. **Given** un usuario `ADMIN` autenticado, **When** accede a empleados, **Then** puede listar, crear, editar y eliminar empleados.
3. **Given** un `ADMIN` en formulario de empleado, **When** envia datos invalidos o backend rechaza la operacion, **Then** el frontend muestra error sin inventar reglas nuevas.

---

### User Story 3 - Consulta y CRUD de Departamentos por Rol (Priority: P3)

Como usuario autenticado, quiero consultar departamentos y, si soy ADMIN, gestionarlos con operaciones de alta, edicion y baja.

**Why this priority**: Completa la cobertura funcional del dominio actual y permite operar departamentos desde frontend respetando permisos.

**Independent Test**: Se valida listado para USER y ADMIN, y que solo ADMIN pueda ver/usar acciones de crear, editar y eliminar.

**Acceptance Scenarios**:

1. **Given** un usuario `USER` autenticado, **When** accede a departamentos, **Then** puede listar y consultar pero no ve acciones de crear, editar o eliminar.
2. **Given** un usuario `ADMIN` autenticado, **When** accede a departamentos, **Then** puede listar, crear, editar y eliminar departamentos.
3. **Given** un `ADMIN` que intenta eliminar un departamento con dependencias, **When** backend responde conflicto, **Then** el frontend muestra el error devuelto por backend.

---

### User Story 4 - Validacion E2E de Flujos Criticos (Priority: P4)

Como responsable de calidad, quiero pruebas E2E que validen los flujos mas importantes de login y CRUD principal para detectar regresiones entre frontend y backend.

**Why this priority**: Garantiza que la integracion frontend-backend se mantenga estable en los flujos de mayor impacto.

**Independent Test**: Se ejecuta suite E2E que cubre login y operaciones principales de empleados y departamentos con comportamiento por rol.

**Acceptance Scenarios**:

1. **Given** la suite E2E configurada, **When** se ejecuta en entorno local del proyecto, **Then** valida login correcto/incorrecto y navegacion protegida.
2. **Given** usuarios `ADMIN` y `USER`, **When** se ejecutan casos E2E de empleados y departamentos, **Then** se confirma que `ADMIN` gestiona y `USER` solo consulta.

### Edge Cases

- Intento de acceso directo por URL a modulo protegido sin sesion activa.
- Credenciales vacias o formato invalido en login.
- Respuesta `401` o `403` del backend durante una sesion iniciada.
- Expiracion o invalidacion de estado de autenticacion durante navegacion.
- Fallas de red o backend no disponible al cargar listados.
- Errores de backend en operaciones de create/update/delete con mensaje de negocio.
- Usuario `USER` intentando ejecutar acciones de escritura por manipulacion del cliente.
- Listados vacios de empleados o departamentos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST add a new frontend application in `frontend/` while keeping the existing backend in `backend/` as the primary source of truth.
- **FR-002**: Frontend MUST be implemented with Angular 22 LTS.
- **FR-003**: Frontend MUST provide a login screen that uses the current backend authentication mechanism.
- **FR-004**: Frontend MUST NOT require backend changes as a mandatory condition for this feature.
- **FR-005**: Frontend MUST include protected navigation so unauthenticated users cannot access internal modules.
- **FR-006**: Frontend MUST provide employee listing view connected to backend data.
- **FR-007**: Frontend MUST provide employee create, update, and delete actions for `ADMIN` users.
- **FR-008**: Frontend MUST provide department listing view connected to backend data.
- **FR-009**: Frontend MUST provide department create, update, and delete actions for `ADMIN` users.
- **FR-010**: Frontend MUST enforce role-reflective UX: `ADMIN` can see/use write actions; `USER` can only consult.
- **FR-011**: Frontend MUST keep real security enforcement in backend and MUST NOT treat client-side checks as authoritative security.
- **FR-012**: Frontend MUST NOT reimplement backend business rules; it must display backend validation/authorization outcomes.
- **FR-013**: Frontend MUST provide basic error handling for login (`401`) and authorization failures (`403`).
- **FR-014**: Frontend MUST provide logout capability that removes active session state and returns user to login.
- **FR-015**: Minimum scope MUST exclude Dockerization for frontend unless explicitly justified and approved later.
- **FR-016**: Cypress E2E coverage MUST include critical login flow and main CRUD flows for empleados and departamentos.
- **FR-017**: E2E tests MUST include role-based behavior validation for both `ADMIN` and `USER`.

### Key Entities *(include if feature involves data)*

- **SesionUsuario**: Estado de autenticacion del usuario en frontend (credenciales activas, rol efectivo para UX, estado autenticado/no autenticado).
- **PermisoUIRol**: Reglas de visibilidad y habilitacion de acciones en interfaz segun rol (`ADMIN` vs `USER`), subordinadas a la respuesta real del backend.
- **EmpleadoViewModel**: Representacion de datos de empleado para listado y formularios, alineada al contrato backend existente.
- **DepartamentoViewModel**: Representacion de datos de departamento para listado y formularios, alineada al contrato backend existente.

## Assumptions

- El backend existente ya expone endpoints operativos para login actual, empleados y departamentos.
- El backend mantiene roles `ADMIN` y `USER` y sus reglas de autorizacion vigentes.
- No se incorpora un nuevo mecanismo de autenticacion en este alcance inicial.
- El entorno local de validacion dispone de backend y base de datos activos para pruebas de integracion y E2E.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de usuarios sin sesion es redirigido a login al intentar acceder a rutas protegidas en las pruebas de aceptacion.
- **SC-002**: El 100% de inicios de sesion con credenciales validas permite acceso a la navegacion principal y el 100% de credenciales invalidas muestra error sin entrar al sistema.
- **SC-003**: En pruebas funcionales, `ADMIN` completa exitosamente operaciones principales de alta, edicion y baja para empleados y departamentos.
- **SC-004**: En pruebas funcionales, `USER` no puede ejecutar operaciones de escritura y solo accede a vistas de consulta.
- **SC-005**: El 100% de errores criticos de autenticacion/autorizacion y conflictos de negocio recibidos desde backend se muestran al usuario con feedback claro.
- **SC-006**: La suite Cypress cubre y ejecuta satisfactoriamente al menos login, CRUD principal de empleados y CRUD principal de departamentos.
