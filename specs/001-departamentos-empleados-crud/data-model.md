# Data Model: CRUD Departamentos y Empleados

## Entity: Departamento

### Fields (persisted)
- `clave` (string, PK, required, max 16)
- `nombre` (string, required, max 100)

### Constraints
- `clave` unica y obligatoria.
- `nombre` obligatorio, maximo 100 caracteres.

## Entity: Empleado (existing, extended)

### Existing persisted fields
- `clave`, `nombre`, `direccion`, `telefono`, `email`, `passwordHash`, `role`

### New persisted relation field
- `departamentoClave` (string, nullable, FK a `departamentos.clave`)

### Constraints
- La relacion con departamento es opcional.
- Si `departamentoClave` se informa, debe existir un `Departamento` valido.

## Relationship
- `Departamento (1) <- (N) Empleado`
- Un departamento puede tener cero o muchos empleados.
- Un empleado puede pertenecer a cero o un departamento.

## API Contract Impact

### Departamento endpoints
- `GET /api/v1/departamentos` (paginado)
- `GET /api/v1/departamentos/{clave}`
- `POST /api/v1/departamentos`
- `PUT /api/v1/departamentos/{clave}`
- `DELETE /api/v1/departamentos/{clave}`

### Empleado payload extension
- `EmpleadoCreateRequest` y `EmpleadoUpdateRequest` aceptan `departamentoClave` opcional.
- Respuesta de empleado puede incluir `departamentoClave` para trazabilidad.

## Validation Rules

### Pagination for departamentos
- `page < 0` -> `400`
- `size < 1` o `size > 100` -> `400`
- `sort` invalido -> `400`

### Business validations
- `departamentoClave` inexistente en create/update de empleado -> `400` con error estandar.
- `DELETE` departamento con empleados asociados -> `409` con error estandar.
- `DELETE` departamento sin empleados asociados -> `204`.
