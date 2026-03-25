# Feature Specification: Frontend Angular Empleados y Departamentos

**Feature Branch**: `005-angular-frontend-login-empleados-departamentos`  
**Created**: 2026-03-19  
**Status**: Draft  
**Input**: User description: "Construir frontend Angular 22 LTS para login, navegación protegida y CRUD de empleados/departamentos consumiendo backend Spring Boot existente con roles ADMIN/USER"

## Scope Closure (Minimum Version)

This section formalizes the approved minimum scope before implementation planning.

### Confirmed Decisions

1. Frontend stack is Angular 22 LTS.
2. Frontend location is a new `frontend/` folder.
3. Login in this first version uses the current backend mechanism (HTTP Basic Auth).
4. Existing backend remains the real authority for authentication, authorization, and business rules.
5. `ADMIN` can create, update, and delete empleados and departamentos.
6. `USER` can only consult empleados and departamentos.
7. Frontend reflects role permissions in navigation and visible actions only; it does not replace backend security.
8. Minimum scope includes:
	- login
	- logout
	- protected routing
	- guards
	- empleado CRUD views
	- departamento CRUD views
	- basic form validations
	- minimum Cypress E2E for critical flows
9. Frontend Dockerization is out of minimum scope.
10. Backend can receive only strict minimal adjustments if required for integration (for example, CORS).

### Explicitly Out of Minimum Scope

- JWT-based authentication.
- Refresh tokens.
- Frontend Dockerization.
- Exhaustive E2E test matrix.
- Backend redesign.
- Major security architecture changes.
- SSR/PWA and advanced frontend optimization tracks.

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
- **FR-018**: Frontend MUST define environment-based backend base URL configuration for local and production-like execution.
- **FR-019**: Frontend MUST include a minimal and explicit CORS compatibility guideline for local development against backend.

## Technical Specification

### 1) Recommended Folder Structure for `frontend/`

```text
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── auth/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── session.service.ts
│   │   │   │   └── auth.interceptor.ts
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   └── http/
│   │   │       └── api-error.interceptor.ts
│   │   ├── features/
│   │   │   ├── login/
│   │   │   │   └── login.page.ts
│   │   │   ├── empleados/
│   │   │   │   ├── empleados-list.page.ts
│   │   │   │   ├── empleado-form.page.ts
│   │   │   │   └── empleados.service.ts
│   │   │   └── departamentos/
│   │   │       ├── departamentos-list.page.ts
│   │   │       ├── departamento-form.page.ts
│   │   │       └── departamentos.service.ts
│   │   ├── layout/
│   │   │   ├── shell.component.ts
│   │   │   └── topbar.component.ts
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   └── models/
│   │   ├── app.routes.ts
│   │   └── app.config.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   └── main.ts
└── cypress/
	├── e2e/
	└── support/
```

### 2) Angular 22 LTS Approach

- Adopt standalone components as the default composition model.
- Use `provideRouter` with feature routes and route guards.
- Keep feature boundaries by domain (`login`, `empleados`, `departamentos`).
- Use `HttpClient` with interceptors for authentication header and common error mapping.

### 3) Required HTTP Services

- `AuthService`: login probe against backend, session bootstrap, logout.
- `SessionService`: in-memory/sessionStorage state for authenticated user and inferred role context.
- `EmpleadosService`: list, detail (optional), create, update, delete against backend endpoints.
- `DepartamentosService`: list, detail (optional), create, update, delete against backend endpoints.

All services MUST call existing backend endpoints and MUST NOT duplicate backend validations.

### 4) Required Guards

- `AuthGuard`: blocks protected routes when there is no active session.
- `RoleGuard`: protects write routes/pages so only `ADMIN` can access create/edit/delete screens.

Route guards are UX controls. Backend remains final authorization authority.

### 5) Simple Basic Auth Strategy (Academic Scope)

- Collect `email` and `password` in login page.
- Build Basic Auth header client-side for requests: `Authorization: Basic <base64(email:password)>`.
- Keep credentials only in session scope (for example, `sessionStorage`) and clear them on logout.
- Never treat frontend session state as proof of authorization; handle backend `401/403` as source of truth.

### 6) Minimum Pages and Components

- `LoginPage`
- `ShellComponent` (protected layout and navigation)
- `EmpleadosListPage`
- `EmpleadoFormPage` (create/edit)
- `DepartamentosListPage`
- `DepartamentoFormPage` (create/edit)
- Shared confirmation and feedback components for delete/error/success flows

### 7) Environments and Backend Base URL

- `environment.ts`: local URL pointing to current backend (for example, `http://localhost:8080`).
- `environment.prod.ts`: production-like URL placeholder per deployment context.
- Backend base URL MUST be centralized in environment config and consumed by services.

### 8) Expected CORS Handling (If Needed)

- If frontend and backend run on different origins in development, backend may need to allow frontend origin (for example `http://localhost:4200`) and `Authorization` header.
- CORS adjustment is considered minimal integration setup, not a business-logic change.
- If same-origin deployment is used later, no special CORS handling is required.

### 9) Role-Reflective UI Without Replacing Backend Security

- For `ADMIN`: show navigation and actions for create/edit/delete.
- For `USER`: hide or disable write actions, keep read-only flows.
- On forced client-side attempts, frontend must still rely on backend response (`403`) and show feedback.
- UI permission reflection is convenience and guidance; backend authorization remains mandatory.

### 10) Cypress E2E Test Strategy (Minimum University Scope)

#### 10.1 Critical Flows to Cover

- Login exitoso (usuario valido).
- Login fallido (credenciales invalidas).
- Navegacion protegida hacia empleados y departamentos tras login.
- Validacion visual de permisos por rol (`ADMIN` vs `USER`).
- Creacion basica de un departamento por `ADMIN`.
- Creacion basica de un empleado por `ADMIN`.

#### 10.2 ADMIN Scenarios

- Debe iniciar sesion correctamente y acceder al shell principal.
- Debe navegar a empleados y departamentos sin bloqueos.
- Debe visualizar acciones de escritura (crear/editar/eliminar) en ambas vistas.
- Debe poder crear un departamento con datos minimos validos y ver confirmacion.
- Debe poder crear un empleado con datos minimos validos y ver confirmacion.

#### 10.3 USER Scenarios

- Debe iniciar sesion correctamente y acceder al shell principal.
- Debe navegar a empleados y departamentos en modo consulta.
- No debe visualizar (o debe ver deshabilitadas) acciones de crear/editar/eliminar.
- Si intenta acceso directo por URL a rutas de escritura, debe ser redirigido o bloqueado por guard.
- Si fuerza accion de escritura desde cliente, debe observar respuesta de backend denegada y mensaje de error.

#### 10.4 Verifiable Acceptance for E2E Suite

- La suite E2E minima contiene al menos 7 specs: login (ok/fail), nav-protected, empleados-role-visibility, departamentos-role-visibility, user-write-forbidden, empleados-admin-crud-smoke, departamentos-admin-crud-smoke.
- Todas las pruebas E2E se ejecutan en entorno local con backend activo y reportan resultado pass/fail reproducible.
- Las pruebas de rol validan comportamiento visual de UI y tambien incluyen rechazo backend ante intento de escritura forzada por `USER`.

#### 10.5 Out of Minimum Scope

- Pruebas de performance/carga y stress.
- Matriz completa de validaciones de campos en todos los formularios.
- Cobertura exhaustiva de todos los mensajes de error de negocio del backend.
- Pruebas cross-browser avanzadas y dispositivos moviles en gran escala.
- Pruebas de recuperacion ante caidas complejas de infraestructura.
- Automatizacion CI/CD obligatoria para Cypress en esta fase inicial.

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
- **SC-006**: La suite Cypress cubre y ejecuta satisfactoriamente login (ok/fail), navegacion protegida, visibilidad/restriccion por rol en empleados y departamentos, rechazo backend de escritura forzada por `USER`, y CRUD smoke de empleados y departamentos para `ADMIN`.
