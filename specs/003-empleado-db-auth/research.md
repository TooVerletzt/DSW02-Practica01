# Phase 0 Research - Empleado DB Auth

## Decision 1: Migración incremental de esquema `empleados`
- Decision: Crear `V2__add_auth_fields_to_empleados.sql` agregando `email`, `password_hash`, `role` y `UNIQUE(email)` con estrategia de endurecimiento progresivo.
- Rationale: Minimiza riesgo sobre datos existentes y evita romper `ddl-auto=validate` en arranque.
- Alternatives considered: Reemplazar tabla completa o recrearla (rechazado: alto riesgo y no incremental).

## Decision 2: Fuente de autenticación desde BD con `UserDetailsService`
- Decision: Reemplazar `InMemoryUserDetailsManager` por `UserDetailsService` que consulta `EmpleadoRepository.findByEmail(...)`.
- Rationale: Cumple requisito de eliminar usuarios hardcodeados manteniendo el mismo mecanismo HTTP Basic.
- Alternatives considered: Implementar JWT o endpoint `/api/v1/auth/login` (rechazado: fuera de alcance MVP confirmado).

## Decision 3: Política de credenciales y hashing
- Decision: Mantener contraseña de entrada en claro solo en transporte Basic Auth y persistir únicamente `password_hash` BCrypt.
- Rationale: Cumple baseline de seguridad sin modificar la interfaz de autenticación definida.
- Alternatives considered: Algoritmos no BCrypt (rechazado: no alineado con requisito explícito).

## Decision 4: Seed inicial idempotente
- Decision: Crear inicializador al arranque que inserte `admin@demo.com` y `user@demo.com` solo si la tabla `empleados` está vacía.
- Rationale: Garantiza entorno de pruebas reproducible sin inserción manual.
- Alternatives considered: Insertar seeds siempre (rechazado: duplicados/colisiones) o depender de SQL fijo no condicional (rechazado: menor control).

## Decision 5: Reglas de autorización por método sin cambiar rutas
- Decision: Mantener `/api/v1/**` autenticado; permitir `GET` a `ADMIN/USER`; restringir `POST/PUT/DELETE` a `ADMIN`; conservar `/actuator/health`, `/swagger-ui/**` y `/v3/api-docs/**` públicos.
- Rationale: Satisface requisitos y preserva operación de Docker healthchecks + exploración Swagger.
- Alternatives considered: Proteger `/actuator/health` (rechazado: rompe healthchecks) o abrir GET sin auth (rechazado: contradice decisiones confirmadas).

## Decision 6: Compatibilidad del CRUD existente
- Decision: Mantener rutas y paginación actuales; ajustar DTOs y servicio únicamente en los campos nuevos necesarios para persistencia/autenticación.
- Rationale: Evita reestructuración y limita el impacto al mínimo requerido.
- Alternatives considered: Crear módulo/auth separado (rechazado: rompe restricción de cambios mínimos).

## Decision 7: Validación funcional con Docker + curl
- Decision: Validar flujo end-to-end con Compose levantado: seed, 401 inválido, 403 USER en escritura, éxito CRUD ADMIN y healthcheck público.
- Rationale: Cobertura directa de criterios de aceptación con bajo costo.
- Alternatives considered: Incorporar suite automatizada completa en esta iteración (rechazado: fuera del alcance de planning mínimo).
