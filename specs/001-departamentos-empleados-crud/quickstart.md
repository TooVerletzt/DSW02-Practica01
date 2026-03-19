# Quickstart: CRUD Departamentos y Empleados

## Prerrequisitos
- Docker + Docker Compose
- curl

## 1) Levantar entorno

```bash
docker compose up -d --build
docker compose ps
```

Esperado:
- `empleados-postgres` healthy
- `empleados-backend` healthy

## 2) Validar health publico

```bash
curl -i http://localhost:8080/actuator/health
```

Esperado: `200` con `{"status":"UP"}`.

## 3) Validar paginacion de departamentos

```bash
curl -i -u user@demo.com:user123 "http://localhost:8080/api/v1/departamentos?page=0&size=10&sort=clave,asc"
```

Esperado:
- `200`
- Body paginado con `content`, `totalElements`, `totalPages`, `number`, `size`.

## 4) Validar reglas de seguridad por rol

Intento de create con `USER`:

```bash
curl -i -u user@demo.com:user123 -X POST http://localhost:8080/api/v1/departamentos \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Sistemas"}'
```

Esperado: `403`.

Create con `ADMIN`:

```bash
DEP_CLAVE=$(curl -s -u admin@demo.com:admin123 -X POST http://localhost:8080/api/v1/departamentos \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Sistemas"}' | sed -n 's/.*"clave":"\([^"]*\)".*/\1/p')

echo "$DEP_CLAVE"
```

Esperado: `201` y `DEP_CLAVE` con formato `DEP-<n>`.

## 5) Validar asignacion de departamento en empleado

Empleado con `departamentoClave` existente:

```bash
curl -i -u admin@demo.com:admin123 -X POST http://localhost:8080/api/v1/empleados \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Ana","direccion":"Calle 1","telefono":"555-111","email":"ana.dep@demo.com","password":"secret123","role":"USER","departamentoClave":"'"$DEP_CLAVE"'"}'
```

Esperado: `201`.

Empleado con `departamentoClave` inexistente:

```bash
curl -i -u admin@demo.com:admin123 -X POST http://localhost:8080/api/v1/empleados \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Luis","direccion":"Calle 2","telefono":"555-222","email":"luis.baddep@demo.com","password":"secret123","role":"USER","departamentoClave":"DEP-404"}'
```

Esperado: `400` con JSON estandar (`timestamp,status,error,message,path`).

## 6) Validar regla de borrado 409/204

Eliminar departamento con empleados asignados:

```bash
curl -i -u admin@demo.com:admin123 -X DELETE "http://localhost:8080/api/v1/departamentos/$DEP_CLAVE"
```

Esperado: `409` con JSON estandar.

Liberar asignacion de empleado (actualizando `departamentoClave` a null) y borrar nuevamente:

```bash
# Sustituir EMP-<n> por la clave real del empleado creado
curl -i -u admin@demo.com:admin123 -X PUT http://localhost:8080/api/v1/empleados/EMP-<n> \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Ana","direccion":"Calle 1","telefono":"555-111","email":"ana.dep@demo.com","password":"secret123","role":"USER","departamentoClave":null}'

curl -i -u admin@demo.com:admin123 -X DELETE "http://localhost:8080/api/v1/departamentos/$DEP_CLAVE"
```

Esperado: `204` en el segundo DELETE.

## 7) Apagar entorno

```bash
docker compose down
```
