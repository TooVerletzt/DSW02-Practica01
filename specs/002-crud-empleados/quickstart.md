# Quickstart - CRUD de Empleados

## Prerrequisitos
- Java 17
- Maven 3.9+
- Docker y Docker Compose

## 1) Iniciar PostgreSQL con Docker
Crear o usar `docker-compose.yml` en la raíz del proyecto con un servicio PostgreSQL y ejecutar:

```bash
docker compose up -d
```

Variables recomendadas para la app:
- `SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5433/empleadosdb`
- `SPRING_DATASOURCE_USERNAME=empleados_user`
- `SPRING_DATASOURCE_PASSWORD=empleados_pass`

### Opción Docker completa (PostgreSQL + Backend)

Desde la raíz del proyecto:

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f empleados-backend
docker compose down
```

Notas:
- En contenedores, el backend usa `jdbc:postgresql://empleados-postgres:5432/empleadosdb`.
- Tu flujo local actual se mantiene: `mvn spring-boot:run` + PostgreSQL en `localhost:5433`.

## 2) Ejecutar backend Spring Boot
Desde `backend/`:

```bash
mvn spring-boot:run
```

La API queda en `http://localhost:8080`.

## 3) Verificar autenticación y autorización
- Todas las rutas de `/empleados` requieren HTTP Basic Auth.
- Usuario autenticado sin rol `admin` debe recibir `403`.
- Solicitud no autenticada debe recibir `401`.

## 4) Probar contrato OpenAPI
- Especificación: `specs/002-crud-empleados/contracts/openapi.yaml`
- Swagger UI (entorno dev): `http://localhost:8080/swagger-ui/index.html`

## 5) Flujo mínimo de validación manual
1. Crear empleado sin enviar `clave` y validar respuesta con `clave` en formato `EMP-<número>`.
2. Intentar crear enviando `clave` manual y validar rechazo (`400`).
3. Consultar por `clave` existente y no existente (`404`).
4. Intentar consultar/actualizar/eliminar con clave de formato inválido y validar `400`.
5. Actualizar empleado existente y validar persistencia sin cambio de `clave`.
6. Actualizar inexistente y validar `404`.
7. Eliminar empleado y validar que no reaparece en consultas.
