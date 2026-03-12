<!--
Sync Impact Report
- Version change: 1.1.0 -> 2.0.0
- Modified principles:
	- III. Basic Auth + Role-Based Authorization Baseline -> III. Empleado Authentication + Role-Based Authorization Baseline
- Added sections:
	- None
- Removed sections:
	- None
- Templates requiring updates:
	- ✅ updated: .specify/templates/plan-template.md
	- ✅ updated: .specify/templates/spec-template.md
	- ✅ updated: .specify/templates/tasks-template.md
	- ✅ updated: .github/agents/copilot-instructions.md
	- ⚠ pending: .specify/templates/commands/*.md (directory not present)
- Deferred TODOs:
	- None
-->

# DSW02-PRACTICA01 Constitution

## Core Principles

### I. Backend-First with Spring Boot 3
All backend services in this project MUST be implemented with Spring Boot 3.
Controllers, service-layer logic, and persistence adapters MUST follow standard
Spring layering with clear responsibility boundaries.

Rationale: a single backend framework reduces maintenance overhead and keeps
architecture decisions consistent across features.

### II. Versioned API Contract Is Mandatory
All business REST endpoints MUST be exposed under the unique prefix `/api/v1`.
Endpoints outside this prefix are prohibited, except for
`/swagger-ui/**`, `/v3/api-docs/**`, and `/actuator/**`.

Rationale: a single versioned namespace prevents route drift and allows
controlled API evolution.

### III. Empleado Authentication + Role-Based Authorization Baseline
Final authentication MUST NOT rely on in-memory users or hardcoded credentials.
Authentication MUST be resolved against persisted `Empleado` records in
PostgreSQL.

Each authenticable employee MUST include:
- unique `email`
- `password` stored as a BCrypt hash
- role value used for authorization decisions (`ADMIN` or `USER`)

The MVP login mechanism MUST use HTTP Basic Authentication with
`email:password`. A dedicated endpoint such as `/api/v1/auth/login` MAY be
added only when explicitly justified by the feature plan; otherwise, Basic Auth
is the default implementation path.

Authorization MUST enforce role `ADMIN` for all write operations
(`POST`, `PUT`, `DELETE`).

Read operations for employee resources MUST be available to authenticated
`ADMIN` and `USER` roles. Any broader read access outside this rule MUST be
explicitly justified in the approved feature specification.

Swagger/OpenAPI UI MUST support `Authorize` with `basicAuth`.

Rationale: Basic Auth provides a simple, enforceable baseline for internal or
early-stage backend APIs while preserving a migration path to stronger schemes.

### IV. PostgreSQL + Dockerized Runtime Parity
Persistent data MUST be stored in PostgreSQL. Development and local validation
MUST run through Docker (e.g., Docker Compose) with a PostgreSQL service.
The default local runtime topology MUST use exactly two containers for this
practice scope: backend + PostgreSQL.

`/actuator/health` MUST remain `permitAll` to keep Docker healthchecks
operational without credentials.

Application configuration MUST support container-based execution without manual,
machine-specific steps.

Rationale: using the same database engine and container workflow across
environments minimizes drift and integration failures.

### V. Pagination Is Mandatory for Employee Listings
The employee collection endpoint (GET list) MUST be paginated. It MUST accept
`page`, `size`, and `sort` query parameters, and MUST return a paginated
response structure with content and page metadata.

Rationale: pagination avoids unbounded payloads and provides predictable
client-side navigation.

## Technical Standards

- Runtime stack MUST remain: Spring Boot 3 + Java 17 + PostgreSQL.
- Java compatibility MUST remain pinned to Java 17 for source, build, and
	runtime images.
- Container assets MUST be maintained (`Dockerfile` and/or `docker-compose.yml`
	as applicable to the service scope).
- Security configuration MUST source identities from persisted `Empleado`
	records (email + BCrypt password + role), not from in-memory users.
- Database access MUST use managed configuration (`application.yml` profiles,
	environment variables, or equivalent secure injection).
- API health and startup readiness MUST be verifiable in containerized local
	execution before merge.
- Feature delivery MUST be incremental and MUST NOT introduce architecture or
	module rewrites outside the scoped change.

## API Standards

- Business REST routes MUST use `/api/v1` as the base path.
- Non-versioned routes are forbidden except `/swagger-ui/**`, `/v3/api-docs/**`,
	and `/actuator/**`.
- OpenAPI definitions MUST declare `basicAuth` and include security
	requirements for protected operations.
- `/actuator/health` MUST stay public (`permitAll`) while business routes remain
	protected.
- Employee list operations MUST support `page`, `size`, `sort` and return
	page metadata with content.

## Delivery Workflow & Quality Gates

- Every feature spec and implementation plan MUST pass a constitution check
	against all five principles.
- Pull requests MUST include evidence for:
	- API base path compliance (`/api/v1`)
	- Security configuration (Empleado-backed Basic Auth with BCrypt validation)
	- Authorization mapping (`ADMIN` write, `USER`/`ADMIN` read)
	- Swagger `basicAuth` Authorize support
	- Public healthcheck behavior (`/actuator/health` as `permitAll`)
	- Pagination behavior for employee list operations
	- Two-container Docker runtime (`postgres` + `backend`) with PostgreSQL connectivity
	- Swagger/OpenAPI availability and updated endpoint documentation
- Changes that violate any principle are blocked until resolved or until this
	constitution is amended through governance.

## Governance

This constitution is authoritative for architecture and delivery decisions in
DSW02-PRACTICA01. In case of conflict, this document supersedes informal team
preferences and ad hoc implementation shortcuts.

Amendment policy:
- Any amendment MUST include (1) proposed change, (2) impact analysis on
	templates/workflow, and (3) migration plan for in-flight work.
- Versioning policy follows semantic versioning:
	- MAJOR: incompatible principle removal/redefinition
	- MINOR: new principle/section or materially expanded obligations
	- PATCH: clarifications without normative impact
- Compliance review is mandatory in planning and code review phases.

**Version**: 2.0.0 | **Ratified**: 2026-02-25 | **Last Amended**: 2026-03-12
