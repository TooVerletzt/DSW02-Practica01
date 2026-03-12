# Data Model - Empleado DB Auth

## Entity: Empleado

### Fields (persisted)
- `clave` (string, PK, required, format `EMP-<número>`)
- `nombre` (string, required, max 100)
- `direccion` (string, required, max 100)
- `telefono` (string, required, max 100)
- `email` (string, required, unique, max 100)
- `passwordHash` (string, required, BCrypt hash)
- `role` (enum, required: `ADMIN` | `USER`)

### Constraints
- `email` MUST be unique in DB.
- `passwordHash` MUST never be exposed in API responses.
- `role` MUST be validated against allowed enum values.

## Value Object: EmpleadoRole

### Values
- `ADMIN`: lectura y escritura (`GET/POST/PUT/DELETE`)
- `USER`: solo lectura (`GET`)

## Value Object: AuthIdentity

### Mapping
- Basic Auth `username` -> `Empleado.email`
- Basic Auth `password` -> verificado con BCrypt contra `Empleado.passwordHash`

## Value Object: EmpleadoSeedProfile

### Entries
- `admin@demo.com` / `admin123` / role `ADMIN`
- `user@demo.com` / `user123` / role `USER`

### Rules
- Solo se inserta seed cuando la tabla `empleados` está vacía.
- Password de seed se persiste únicamente como hash BCrypt.

## API Contract Impact
- Se mantienen rutas bajo `/api/v1/empleados`.
- Se mantiene paginación de `GET /api/v1/empleados` (`page`, `size`, `sort`).
- Se agregan/ajustan campos de entrada/salida según necesidad del CRUD sin exponer `passwordHash`.

## State Transitions
- `NON_EXISTENT -> ACTIVE`: creación de empleado (incluye identidad de auth).
- `ACTIVE -> ACTIVE`: actualización de datos y/o credenciales (si aplica).
- `ACTIVE -> NON_EXISTENT`: eliminación física del empleado.

## Validation Rules
- `email`: requerido, formato email válido, max 100, único.
- `password` de entrada (cuando aplique en create/update): no vacía; se transforma a `passwordHash` BCrypt antes de persistir.
- `role`: requerido y dentro de `ADMIN|USER`.
- Reglas de seguridad por método:
  - `GET`: `ADMIN` o `USER`
  - `POST/PUT/DELETE`: `ADMIN`
