# Phase 0 Research - CRUD de Empleados

## Decision 1: Runtime stack
- Decision: Use Spring Boot 3 with Java 17.
- Rationale: The constitution mandates this stack and it aligns with REST CRUD requirements.
- Alternatives considered: Quarkus (rejected: constitution mismatch), Node.js/Express (rejected: constitution mismatch).

## Decision 2: Persistence strategy
- Decision: Use PostgreSQL with a single `empleados` table and a generated employee key with format `EMP-<número>` as the primary external identifier.
- Rationale: Constitution requires PostgreSQL; feature requires a unique auto-generated key with fixed prefix and numeric sequence.
- Alternatives considered: In-memory DB (rejected: no runtime parity), MySQL (rejected: constitution mismatch).

## Decision 3: Authentication and authorization
- Decision: Protect all endpoints with HTTP Basic Authentication and require role `admin`.
- Rationale: Feature clarifications require auth + admin; constitution sets Basic Auth as security baseline.
- Alternatives considered: Public endpoints (rejected: violates requirements), JWT-only (rejected: unnecessary scope for MVP).

## Decision 4: Validation and normalization
- Decision: Generate `clave` automatically in format `EMP-<número>`; validate key format only on read/update/delete; enforce max length 100 on `nombre`, `dirección`, `teléfono`; trim text fields before validation/persistence.
- Rationale: Directly satisfies FR-002A/FR-002B, FR-003/004/005/005A, FR-010A and FR-013.
- Alternatives considered: Regex validation for phone (rejected: explicitly out of scope), reject leading/trailing spaces (rejected: clarified behavior is trimming).

## Decision 5: Error semantics
- Decision: Return `404 Not Found` for update/delete on non-existent employee; return `400 Bad Request` for invalid key format or manual key in create payload; return differentiated `401` (not authenticated) and `403` (missing admin role).
- Rationale: Keeps error contracts explicit and testable, aligned with feature clarifications.
- Alternatives considered: Generic `400` for all failures (rejected: weak diagnosability), upsert on update (rejected: contradicts clarification).

## Decision 6: API contract visibility
- Decision: Maintain an OpenAPI contract for all employee endpoints and expose Swagger UI in development.
- Rationale: Constitution requires API documentation continuity with code changes.
- Alternatives considered: Postman collection only (rejected: does not satisfy constitution gate).

## Decision 7: Local runtime parity
- Decision: Use Docker Compose to run PostgreSQL locally; backend connects using environment-driven configuration.
- Rationale: Constitution requires Dockerized runtime parity and avoids machine-specific setup.
- Alternatives considered: Host-installed PostgreSQL only (rejected: drift risk), embedded DB (rejected: parity mismatch).
