# Data Model - CRUD de Empleados API v1

## Entity: Empleado

### Fields
- `clave` (string, required)
  - Identificador de empleado con formato `EMP-<número>`.
- `nombre` (string, required, max 100)
- `direccion` (string, required, max 100)
- `telefono` (string, required, max 100)

## Value Object: SolicitudListadoPaginado

### Fields
- `page` (integer, optional, default `0`)
- `size` (integer, optional, default `10`)
- `sort` (string, optional, default `clave,asc`; acepta `clave,desc`)

## Value Object: PaginaEmpleados

### Fields
- `content` (array of Empleado)
- `totalElements` (integer)
- `totalPages` (integer)
- `number` (integer, página actual)
- `size` (integer, tamaño de página)

## Validation Rules
- Endpoints de negocio bajo `/api/v1/empleados` y `/api/v1/empleados/{clave}`.
- `GET` requiere autenticación básica y permite roles `ADMIN` o `USER`.
- `POST`, `PUT`, `DELETE` requieren autenticación básica y rol `ADMIN`.
- `swagger-ui` y `v3/api-docs` quedan accesibles; `/actuator/health` queda público.
- Defaults de paginación se aplican cuando no se envían parámetros.

## State Transitions
- `NON_EXISTENT -> ACTIVE` en alta.
- `ACTIVE -> ACTIVE` en actualización.
- `ACTIVE -> NON_EXISTENT` en eliminación física.
