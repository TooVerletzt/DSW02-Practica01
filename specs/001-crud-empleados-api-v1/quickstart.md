# Quickstart - CRUD de Empleados API v1

## Prerrequisitos
- Java 17
- Maven 3.9+
- Docker y Docker Compose

## 1) Levantar servicios

```bash
docker compose up -d --build
docker compose ps
```

## 2) Verificar endpoint de salud (sin auth)

```bash
curl -s http://localhost:8080/actuator/health
```

Resultado esperado: contiene `"status":"UP"`.

## 3) Verificar Swagger

Abrir:
- `http://localhost:8080/swagger-ui/index.html`

Validar:
- Rutas documentadas bajo `/api/v1/**`.
- Botón `Authorize` disponible con esquema `basicAuth`.

## 4) Verificar paginación en listado

Con USER:

```bash
curl -i -u user:user123 "http://localhost:8080/api/v1/empleados?page=0&size=2&sort=clave,desc"
```

Con ADMIN:

```bash
curl -i -u admin:admin123 "http://localhost:8080/api/v1/empleados?page=0&size=2&sort=clave,desc"
```

Resultado esperado:
- HTTP `200`.
- Cuerpo con `content`, `totalElements`, `totalPages`, `number`, `size`.

## 5) Verificar paginación inválida (debe responder 400)

```bash
curl -i -u admin:admin123 "http://localhost:8080/api/v1/empleados?page=-1&size=10&sort=clave,asc"
curl -i -u admin:admin123 "http://localhost:8080/api/v1/empleados?page=0&size=0&sort=clave,asc"
curl -i -u admin:admin123 "http://localhost:8080/api/v1/empleados?page=0&size=101&sort=clave,asc"
curl -i -u admin:admin123 "http://localhost:8080/api/v1/empleados?page=0&size=10&sort=nombre,asc"
```

Resultado esperado:
- HTTP `400` en todos los casos.
- Cuerpo JSON con `timestamp`, `status`, `error`, `message`, `path`.

## 6) Verificar autorización por operación

POST/PUT/DELETE con USER (deben fallar por permisos):

```bash
curl -i -u user:user123 -X POST http://localhost:8080/api/v1/empleados -H 'Content-Type: application/json' -d '{"nombre":"A","direccion":"B","telefono":"C"}'
curl -i -u user:user123 -X PUT http://localhost:8080/api/v1/empleados/EMP-1 -H 'Content-Type: application/json' -d '{"nombre":"A","direccion":"B","telefono":"C"}'
curl -i -u user:user123 -X DELETE http://localhost:8080/api/v1/empleados/EMP-1
```

POST/PUT/DELETE con ADMIN (deben respetar comportamiento funcional existente):

```bash
curl -i -u admin:admin123 -X POST http://localhost:8080/api/v1/empleados -H 'Content-Type: application/json' -d '{"nombre":"A","direccion":"B","telefono":"C"}'
curl -i -u admin:admin123 -X PUT http://localhost:8080/api/v1/empleados/EMP-1 -H 'Content-Type: application/json' -d '{"nombre":"A","direccion":"B","telefono":"C"}'
curl -i -u admin:admin123 -X DELETE http://localhost:8080/api/v1/empleados/EMP-1
```

## 7) Evidencia de persistencia DB en Docker

Crear empleado con ADMIN:

```bash
curl -i -u admin:admin123 -X POST http://localhost:8080/api/v1/empleados -H 'Content-Type: application/json' -d '{"nombre":"Persistencia QA","direccion":"Docker","telefono":"555-0101"}'
```

Listar con USER o ADMIN y confirmar que el registro creado aparece en `content`:

```bash
curl -i -u user:user123 "http://localhost:8080/api/v1/empleados?page=0&size=20&sort=clave,desc"
```

Resultado esperado:
- El empleado recién creado se observa en el listado.
- Tras reinicio del backend sin borrar volumen, el registro sigue disponible.

## 8) Logs y apagado

```bash
docker compose logs -f empleados-backend
docker compose down
```

## Archivos exactos a tocar en implementación

- `backend/src/main/java/com/dsw02/empleados/controller/EmpleadoController.java`
- `backend/src/main/java/com/dsw02/empleados/service/EmpleadoService.java`
- `backend/src/main/java/com/dsw02/empleados/repository/EmpleadoRepository.java`
- `backend/src/main/java/com/dsw02/empleados/config/SecurityConfig.java`
- `backend/src/main/java/com/dsw02/empleados/config/OpenApiConfig.java`
- `specs/001-crud-empleados-api-v1/contracts/openapi.yaml`
- `specs/001-crud-empleados-api-v1/quickstart.md`

## Nota de healthchecks

- Mantener healthchecks de `docker-compose.yml` funcionales y sin credenciales embebidas en comandos de healthcheck.
