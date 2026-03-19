# DSW02-PRACTICA01 Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-05

## Active Technologies
- Java 17 + Spring Boot 3 (Web, Data JPA, Security, Validation, Actuator), Spring Data Pageable, springdoc-openapi (001-crud-empleados-api-v1)
- Java 17 + Spring Boot 3.3.x (Web, Data JPA, Security, Validation, Actuator), Spring Data Pageable, Flyway, springdoc-openapi (001-empleado-db-auth)
- PostgreSQL (tabla `empleados`) (001-empleado-db-auth)
- Java 17 + Spring Boot 3.3.x (Web, Data JPA, Security, Validation, Actuator), Flyway, springdoc-openapi (001-departamentos-empleados-crud)

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
- 005-frontend-angular22: Added governance for Angular 22 LTS frontend consuming existing Spring Boot backend as source of truth, role-reflective UI, and Cypress critical E2E coverage
- 001-departamentos-empleados-crud: Added Java 17 + Spring Boot 3.3.x (Web, Data JPA, Security, Validation, Actuator), Flyway, springdoc-openapi
- 001-empleado-db-auth: Added Java 17 + Spring Boot 3.3.x (Web, Data JPA, Security, Validation, Actuator), Spring Data Pageable, Flyway, springdoc-openapi
- 001-crud-empleados-api-v1: Added Java 17 + Spring Boot 3 (Web, Data JPA, Security, Validation, Actuator), Spring Data Pageable, springdoc-openapi


<!-- MANUAL ADDITIONS START -->
- Frontend (when in scope) must use Angular 22 LTS and consume backend APIs without reimplementing backend business logic.
- Security authority remains in backend; frontend role checks are UX behavior only.
- Frontend login must use current backend auth mechanism unless an approved migration is documented.
- Cypress must cover critical login flow plus primary employee/departamento CRUD flows.
- Frontend Docker is outside minimum scope unless explicitly justified.
<!-- MANUAL ADDITIONS END -->
