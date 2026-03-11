<!--
Sync Impact Report
- Version change: 1.0.0 -> 1.1.0
- Modified principles:
	- II. Java 17 Compatibility Is Mandatory -> II. Versioned API Contract Is Mandatory
	- III. Security Baseline with HTTP Basic Authentication -> III. Basic Auth + Role-Based Authorization Baseline
	- V. API Documentation via Swagger/OpenAPI -> V. Pagination Is Mandatory for Employee Listings
- Added sections:
	- API Standards
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

### III. Basic Auth + Role-Based Authorization Baseline
Authentication MUST use HTTP Basic Authentication. For test and local validation
flows, the fixed admin credential MUST be `admin/admin123`.

Authorization MUST enforce role `ADMIN` for all write operations
(`POST`, `PUT`, `DELETE`). Read operations MAY be broader only if explicitly
documented by feature specification.

Swagger/OpenAPI UI MUST support `Authorize` with `basicAuth`.

Rationale: Basic Auth provides a simple, enforceable baseline for internal or
early-stage backend APIs while preserving a migration path to stronger schemes.

### IV. PostgreSQL + Dockerized Runtime Parity
Persistent data MUST be stored in PostgreSQL. Development and local validation
MUST run through Docker (e.g., Docker Compose) with a PostgreSQL service.
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
- Database access MUST use managed configuration (`application.yml` profiles,
	environment variables, or equivalent secure injection).
- API health and startup readiness SHOULD be verifiable in containerized local
	execution before merge.

## API Standards

- Business REST routes MUST use `/api/v1` as the base path.
- Non-versioned routes are forbidden except `/swagger-ui/**`, `/v3/api-docs/**`,
	and `/actuator/**`.
- OpenAPI definitions MUST declare `basicAuth` and include security
	requirements for protected operations.
- Employee list operations MUST support `page`, `size`, `sort` and return
	page metadata with content.

## Delivery Workflow & Quality Gates

- Every feature spec and implementation plan MUST pass a constitution check
	against all five principles.
- Pull requests MUST include evidence for:
	- API base path compliance (`/api/v1`)
	- Security configuration (Basic Auth + ADMIN write restrictions)
	- Swagger `basicAuth` Authorize support
	- Pagination behavior for employee list operations
	- PostgreSQL connectivity in Dockerized local runtime
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

**Version**: 1.1.0 | **Ratified**: 2026-02-25 | **Last Amended**: 2026-03-05
