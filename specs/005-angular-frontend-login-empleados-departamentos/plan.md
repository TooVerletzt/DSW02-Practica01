# Implementation Plan: Frontend Angular Login Empleados y Departamentos

**Branch**: `005-angular-frontend-login-empleados-departamentos` | **Date**: 2026-03-19 | **Spec**: `/home/abrahamcastro/DSW02/DSW02-PRACTICA01/specs/005-angular-frontend-login-empleados-departamentos/spec.md`
**Input**: Feature specification from `/home/abrahamcastro/DSW02/DSW02-PRACTICA01/specs/005-angular-frontend-login-empleados-departamentos/spec.md`

## Summary

Implementar un frontend Angular 22 LTS en `frontend/` para consumir el backend Spring Boot existente sin modificar su arquitectura. El frontend cubrira login/logout, routing protegido, guards, vistas CRUD de empleados y departamentos con reflejo visual de permisos por rol (`ADMIN`/`USER`) y suite minima de Cypress para flujos criticos. La seguridad y reglas de negocio permaneceran en backend; frontend solo orquesta UX e integracion.

## Technical Context

**Language/Version**: TypeScript 5.x + Angular 22 LTS  
**Primary Dependencies**: `@angular/router`, `@angular/forms`, `@angular/common/http`, Cypress  
**Storage**: `sessionStorage` para estado de sesion del cliente (sin cambios de BD)  
**Testing**: Cypress E2E (minimo critico)  
**Target Platform**: Navegador web moderno (Chrome/Chromium en entorno local)
**Project Type**: Web application (frontend + backend existente)  
**Performance Goals**: Tiempo de carga inicial aceptable para entorno academico (<3s local en equipo promedio)  
**Constraints**: Mantener Basic Auth actual, no Docker frontend, no JWT/refresh tokens, no reestructuracion backend, solo ajuste minimo CORS si es estrictamente necesario  
**Scale/Scope**: MVP academico con modulos login, empleados, departamentos y E2E minimo

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Stack gate: PASS (backend Spring Boot 3 + Java 17 intacto; frontend Angular 22 LTS).
- API versioning gate: PASS (frontend consume `/api/v1/**` existente).
- Security gate: PASS (Basic Auth existente se mantiene).
- Identity source gate: PASS (identidades siguen en `Empleado` persistido, sin in-memory).
- Authorization gate: PASS (backend mantiene autoridad; frontend refleja rol en UX).
- Security authority gate: PASS (frontend no sustituye enforcement backend).
- Source-of-truth gate: PASS (no se reimplementan reglas de negocio en frontend).
- Login gate: PASS (mecanismo actual Basic Auth se conserva).
- Data gate: PASS (sin cambios de persistencia/BD).
- Runtime gate: PASS (docker actual backend+postgres sin cambio obligatorio).
- Frontend runtime gate: PASS (frontend Docker fuera de alcance minimo).
- Documentation gate: PASS (se mantiene contrato backend y se documenta consumo frontend).
- Pagination gate: PASS (frontend consume paginacion existente de empleados/departamentos).
- E2E gate: PASS (Cypress minimo cubre login + CRUD principal por rol).

Pre-Phase 0 status: PASS.

## Project Structure

### Documentation (this feature)

```text
specs/005-angular-frontend-login-empleados-departamentos/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── frontend-routes-and-api-consumption.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
└── ...

frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── auth/
│   │   │   ├── guards/
│   │   │   └── http/
│   │   ├── features/
│   │   │   ├── login/
│   │   │   ├── empleados/
│   │   │   └── departamentos/
│   │   ├── layout/
│   │   ├── shared/
│   │   ├── app.routes.ts
│   │   └── app.config.ts
│   ├── environments/
│   └── main.ts
└── cypress/
```

**Structure Decision**: Arquitectura web con frontend separado en `frontend/` y backend existente en `backend/`, manteniendo acoplamiento via HTTP contracts existentes.

## Implementation Strategy (Minimum and Safe)

1. Bootstrap Angular 22 en `frontend/` con standalone + routing.
2. Implementar capa core (`AuthService`, `SessionService`, `AuthInterceptor`, `ApiErrorInterceptor`, `AuthGuard`, `RoleGuard`).
3. Implementar `LoginPage`, `ShellComponent`, `logout` y rutas protegidas.
4. Implementar modulo empleados (list + form + create/update/delete solo visible para `ADMIN`).
5. Implementar modulo departamentos (list + form + create/update/delete solo visible para `ADMIN`).
6. Integrar manejo de errores `401/403` y mensajes de backend.
7. Configurar Cypress minimo y escribir casos criticos acordados.
8. Ajustar CORS backend solo si frontend/backend en distinto origen lo requiere para desarrollo local.

## Risks & Mitigation

1. **Riesgo**: Exposicion de credenciales Basic en cliente.
- **Mitigacion**: Alcance academico; sessionStorage, logout estricto, no persistencia prolongada, no logging de credenciales.

2. **Riesgo**: Divergencia entre permisos visuales y permisos backend.
- **Mitigacion**: Backend siempre decide; frontend consume `403` y muestra feedback, sin asumir permisos reales.

3. **Riesgo**: CORS bloqueando llamadas locales.
- **Mitigacion**: Habilitacion minima de origen `http://localhost:4200` y header `Authorization` si es necesario.

4. **Riesgo**: Sobrecarga de alcance E2E.
- **Mitigacion**: Mantener solo suite critica (login ok/fail, navegacion protegida, visibilidad por rol, create basico admin).

## Explicit Non-Goals (Do Not Implement)

- JWT / refresh tokens.
- SSR / PWA.
- Frontend Docker y cambios obligatorios a docker-compose.
- Cambios de base de datos.
- Rediseno backend o cambios grandes de seguridad.

## Post-Design Constitution Check

- Stack gate: PASS.
- API versioning gate: PASS.
- Security gate: PASS.
- Identity source gate: PASS.
- Authorization gate: PASS.
- Security authority gate: PASS.
- Source-of-truth gate: PASS.
- Login gate: PASS.
- Data gate: PASS.
- Runtime gate: PASS.
- Frontend runtime gate: PASS.
- Documentation gate: PASS.
- Pagination gate: PASS.
- E2E gate: PASS.

Post-Phase 1 status: PASS.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
