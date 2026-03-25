# Research: Frontend Angular Login Empleados y Departamentos

## Decision 1: Frontend architecture style
- Decision: Use Angular 22 standalone components with feature-based routing.
- Rationale: Lower boilerplate and clear modularity for an MVP academic scope.
- Alternatives considered:
  - NgModule-heavy architecture.
  - Monolithic single-page component structure.

## Decision 2: Authentication integration
- Decision: Keep current backend Basic Auth flow and send `Authorization: Basic <base64(email:password)>` from frontend.
- Rationale: Matches constitution and avoids backend redesign.
- Alternatives considered:
  - Introduce JWT in frontend/backend.
  - Add custom login endpoint for token exchange in this phase.

## Decision 3: Session handling
- Decision: Store session auth context in `sessionStorage` (academic scope) and clear on logout.
- Rationale: Minimal persistence, simple behavior, lower implementation complexity.
- Alternatives considered:
  - LocalStorage persistence.
  - In-memory only session state.

## Decision 4: Role-based UX strategy
- Decision: Reflect permissions in UI (show/hide/disable write actions by role) while backend remains enforcement authority.
- Rationale: Better user guidance without compromising backend security model.
- Alternatives considered:
  - Expose all actions and rely only on backend errors.
  - Duplicate backend authorization logic on frontend.

## Decision 5: Cypress minimum E2E scope
- Decision: Cover critical flows only (login ok/fail, protected navigation, role visibility, basic create for departamento and empleado as ADMIN).
- Rationale: Realistic university scope with strong integration confidence.
- Alternatives considered:
  - Full regression matrix from first iteration.
  - No E2E tests in MVP.

## Decision 6: Backend adjustments policy
- Decision: No backend restructuring; allow minimal CORS config only if cross-origin local setup requires it.
- Rationale: Keeps backend stable and aligned with approved scope closure.
- Alternatives considered:
  - Immediate backend refactor for frontend convenience.
  - Mandatory proxy-only approach without backend CORS fallback.
