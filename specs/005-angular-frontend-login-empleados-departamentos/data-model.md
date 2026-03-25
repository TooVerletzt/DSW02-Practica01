# Data Model: Frontend Angular Login Empleados y Departamentos

## Entity: SesionUsuario

### Fields
- `email`: string
- `role`: enum (`ADMIN`, `USER`)
- `basicAuthHeader`: string (session-scoped)
- `isAuthenticated`: boolean

### Validation Rules
- `email` is required for login attempts.
- `basicAuthHeader` must be present for protected API requests.
- Session state must be cleared on logout and on unauthorized invalidation.

## Entity: PermisoUIRol

### Fields
- `canReadEmpleados`: boolean
- `canWriteEmpleados`: boolean
- `canReadDepartamentos`: boolean
- `canWriteDepartamentos`: boolean

### Rules
- For `ADMIN`: all read/write flags true.
- For `USER`: read flags true, write flags false.
- These flags drive UI visibility only; backend remains final authority.

## Entity: EmpleadoViewModel

### Fields (aligned to backend contract)
- `clave`: string
- `nombre`: string
- `direccion`: string
- `telefono`: string
- `email`: string
- `role`: enum (`ADMIN`, `USER`)
- `departamentoClave`: string | null

### Validation Rules (frontend basic)
- Required fields for create/update forms follow backend-required inputs.
- Field-level format checks are basic UX aids and must not replace backend validations.

## Entity: DepartamentoViewModel

### Fields (aligned to backend contract)
- `clave`: string
- `nombre`: string

### Validation Rules (frontend basic)
- `nombre` required for create/update forms.
- `clave` is read-only in create response and display contexts.

## State Transitions

### Authentication
- `unauthenticated` -> `authenticated` on successful login.
- `authenticated` -> `unauthenticated` on logout or backend `401` invalidation.

### Role Context
- Resolved after login and used to derive `PermisoUIRol`.
- Recomputed on session restore.

### CRUD Feedback
- `idle` -> `submitting` -> `success|error` for create/update/delete actions.
