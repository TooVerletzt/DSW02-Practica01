# Contract: Frontend Routes and Backend API Consumption

## Frontend Route Contract (Minimum)

- `/login` (public)
- `/` -> redirects to `/empleados` for authenticated users
- `/empleados` (protected, read for ADMIN/USER)
- `/empleados/nuevo` (protected, ADMIN only)
- `/empleados/:clave/editar` (protected, ADMIN only)
- `/departamentos` (protected, read for ADMIN/USER)
- `/departamentos/nuevo` (protected, ADMIN only)
- `/departamentos/:clave/editar` (protected, ADMIN only)

## Backend API Consumption Contract

### Authentication
- Mechanism: HTTP Basic Auth
- Header format: `Authorization: Basic <base64(email:password)>`

### Empleados Endpoints (existing backend)
- `GET /api/v1/empleados?page={page}&size={size}&sort={field,direction}`
- `GET /api/v1/empleados/{clave}` (optional detail flow)
- `POST /api/v1/empleados` (ADMIN)
- `PUT /api/v1/empleados/{clave}` (ADMIN)
- `DELETE /api/v1/empleados/{clave}` (ADMIN)

### Departamentos Endpoints (existing backend)
- `GET /api/v1/departamentos?page={page}&size={size}&sort={field,direction}`
- `GET /api/v1/departamentos/{clave}` (optional detail flow)
- `POST /api/v1/departamentos` (ADMIN)
- `PUT /api/v1/departamentos/{clave}` (ADMIN)
- `DELETE /api/v1/departamentos/{clave}` (ADMIN)

## Error Handling Contract (Frontend Expectations)

- `401`: invalid credentials or expired/invalid session -> redirect/login feedback.
- `403`: forbidden by role -> show authorization message.
- `400`: validation/business input issue -> display backend message.
- `404`: resource not found -> contextual feedback.
- `409`: conflict (e.g., departamento in use) -> conflict message from backend.

## Role Reflection Contract

- `ADMIN`: show create/edit/delete actions in empleados/departamentos views.
- `USER`: hide or disable create/edit/delete actions; keep read-only navigation.
- Any unauthorized forced action must still rely on backend response.
