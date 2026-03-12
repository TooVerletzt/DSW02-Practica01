# Quickstart - Empleado DB Auth

## Prerrequisitos
- Docker + Docker Compose
- `curl`

## Precondición de datos

- Esta práctica asume **BD limpia**; no se implementa backfill automático de datos legacy.
- Si existen datos incompatibles en el volumen de PostgreSQL, ejecutar antes de levantar:

```bash
docker compose down -v
```

## 1) Levantar entorno

```bash
docker compose up -d --build
docker compose ps
```

Verificar que ambos contenedores están `healthy`:
- `empleados-postgres`
- `empleados-backend`

## 2) Validar healthcheck público

```bash
curl -i http://localhost:8080/actuator/health
```

Esperado:
- HTTP `200`
- body con `"status":"UP"`

## 3) Validar Swagger + Authorize

Abrir:
- `http://localhost:8080/swagger-ui/index.html`

Esperado:
- UI accesible sin auth.
- Botón `Authorize` disponible para esquema `basicAuth`.

## 4) Validar seed inicial y login correcto

Con usuario seed `USER`:

```bash
curl -i -u user@demo.com:user123 "http://localhost:8080/api/v1/empleados?page=0&size=5&sort=clave,asc"
```

Esperado:
- HTTP `200`
- Respuesta paginada con `content`, `totalElements`, `totalPages`, `number`, `size`.

## 4.1) Validar que no hay duplicados por email (seed idempotente)

Antes de reinicios:

```bash
docker exec -it empleados-postgres psql -U empleados_user -d empleadosdb -c "SELECT email, COUNT(*) FROM empleados GROUP BY email HAVING COUNT(*) > 1;"
```

Reiniciar backend dos veces:

```bash
docker compose restart empleados-backend
docker compose restart empleados-backend
```

Repetir query y confirmar 0 filas:

```bash
docker exec -it empleados-postgres psql -U empleados_user -d empleadosdb -c "SELECT email, COUNT(*) FROM empleados GROUP BY email HAVING COUNT(*) > 1;"
```

## 5) Validar `401` por credenciales inválidas

```bash
curl -i -u user@demo.com:wrongpass "http://localhost:8080/api/v1/empleados?page=0&size=5&sort=clave,asc"
```

Esperado:
- HTTP `401 Unauthorized`

## 6) Validar `403` para escritura con `USER`

```bash
curl -i -u user@demo.com:user123 -X POST http://localhost:8080/api/v1/empleados \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Test User","direccion":"Dir","telefono":"555-0000","email":"nuevo-user@demo.com","password":"userpass123","role":"USER"}'
```

Esperado:
- HTTP `403 Forbidden`

## 7) Validar CRUD exitoso con `ADMIN`

Crear:

```bash
curl -i -u admin@demo.com:admin123 -X POST http://localhost:8080/api/v1/empleados \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Test Admin","direccion":"Dir","telefono":"555-1111","email":"nuevo-admin@demo.com","password":"adminpass123","role":"ADMIN"}'
```

Guardar la `clave` devuelta por el `POST` (campo `clave`) para usarla en `PUT/DELETE/GET`.

Actualizar (reemplazar `EMP-<n>` por clave real):

```bash
curl -i -u admin@demo.com:admin123 -X PUT http://localhost:8080/api/v1/empleados/EMP-1 \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Test Admin Edit","direccion":"Dir 2","telefono":"555-2222","email":"nuevo-admin@demo.com","password":"adminpass123","role":"ADMIN"}'
```

Eliminar:

```bash
curl -i -u admin@demo.com:admin123 -X DELETE http://localhost:8080/api/v1/empleados/EMP-1
```

Esperado:
- `POST` -> `201`
- `PUT` -> `200`
- `DELETE` -> `204`

Verificar `404` posterior al borrado (reemplazar `EMP-<n>` por la misma clave eliminada):

```bash
curl -i -u admin@demo.com:admin123 http://localhost:8080/api/v1/empleados/EMP-1
```

Esperado:
- `GET` posterior -> `404`

## 8) Apagar entorno

```bash
docker compose down
```

## Archivos de implementación previstos

- `backend/src/main/resources/db/migration/V2__add_auth_fields_to_empleados.sql`
- `backend/src/main/java/com/dsw02/empleados/model/Empleado.java`
- `backend/src/main/java/com/dsw02/empleados/repository/EmpleadoRepository.java`
- `backend/src/main/java/com/dsw02/empleados/config/SecurityConfig.java`
- `backend/src/main/java/com/dsw02/empleados/config/EmpleadoSeedInitializer.java`
- `backend/src/main/java/com/dsw02/empleados/service/EmpleadoService.java`
- `backend/src/main/java/com/dsw02/empleados/model/EmpleadoCreateRequest.java`
- `backend/src/main/java/com/dsw02/empleados/model/EmpleadoUpdateRequest.java`
- `backend/src/main/java/com/dsw02/empleados/model/EmpleadoResponse.java`
