# DSW02-PRACTICA01 Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-05

## Active Technologies
- Java 17 + Spring Boot 3 (Web, Data JPA, Security, Validation, Actuator), Spring Data Pageable, springdoc-openapi (001-crud-empleados-api-v1)
- Java 17 + Spring Boot 3.3.x (Web, Data JPA, Security, Validation, Actuator), Spring Data Pageable, Flyway, springdoc-openapi (001-empleado-db-auth)
- PostgreSQL (tabla `empleados`) (001-empleado-db-auth)
- Java 17 + Spring Boot 3.3.x (Web, Data JPA, Security, Validation, Actuator), Flyway, springdoc-openapi (001-departamentos-empleados-crud)
- TypeScript 5.x + Angular 22 LTS + `@angular/router`, `@angular/forms`, `@angular/common/http`, Cypress (005-angular-frontend-login-empleados-departamentos)
- `sessionStorage` para estado de sesion del cliente (sin cambios de BD) (005-angular-frontend-login-empleados-departamentos)

- Java 17 + Spring Boot 3 (Web, Data JPA, Security, Validation), PostgreSQL Driver, springdoc-openapi (002-crud-empleados)

## Project Structure

```text
src/
tests/
```

## Commands

# Add commands for Java 17

## Code Style

Java 17: Follow standard conventions

## Recent Changes
- 005-angular-frontend-login-empleados-departamentos: Added TypeScript 5.x + Angular 22 LTS + `@angular/router`, `@angular/forms`, `@angular/common/http`, Cypress
- 005-frontend-angular22: Added governance for Angular 22 LTS frontend consuming existing Spring Boot backend as source of truth, role-reflective UI, and Cypress critical E2E coverage
- 001-departamentos-empleados-crud: Added Java 17 + Spring Boot 3.3.x (Web, Data JPA, Security, Validation, Actuator), Flyway, springdoc-openapi


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
