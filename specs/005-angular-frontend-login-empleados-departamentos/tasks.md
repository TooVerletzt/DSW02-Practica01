# Tasks: Frontend Angular Login Empleados y Departamentos

**Input**: Design documents from `/specs/005-angular-frontend-login-empleados-departamentos/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/frontend-routes-and-api-consumption.md`, `quickstart.md`

**Organization**: Tasks are grouped by user story and minimum-scope implementation flow.

## Format: `[ID] [P?] [Story] Description with file path`

- `[P]` = parallelizable (different files, no blocking dependency)
- `[Story]` = story mapping (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Every task includes `Files/Areas`, `Done`, `Evidence`, `Depends`

## Phase 1: Setup (Project Bootstrap)

**Purpose**: Initialize Angular 22 workspace in `frontend/` and baseline app wiring.

- [ ] T001 Bootstrap Angular 22 LTS app in frontend/
  Files/Areas: `frontend/package.json`, `frontend/angular.json`, `frontend/tsconfig*.json`, `frontend/src/main.ts`
  Done: Angular 22 app scaffolding created and runs locally.
  Evidence: `cd frontend && npm install && npm start` launches app.
  Depends: None

- [ ] T002 Configure base routing, environments, and HttpClient providers
  Files/Areas: `frontend/src/app/app.routes.ts`, `frontend/src/app/app.config.ts`, `frontend/src/environments/environment.ts`, `frontend/src/environments/environment.prod.ts`
  Done: Base routes and backend base URL config defined; HttpClient provided globally.
  Evidence: Build succeeds and app resolves routes without runtime injector errors.
  Depends: T001

- [ ] T003 [P] Create core folder structure and shared model placeholders
  Files/Areas: `frontend/src/app/core/**`, `frontend/src/app/shared/**`, `frontend/src/app/features/**`, `frontend/cypress/**`
  Done: Planned directory layout exists for auth/guards/http/features/layout/shared/cypress.
  Evidence: Tree matches documented structure in spec/plan.
  Depends: T001

- [ ] T004 [P] Add npm scripts for app run and Cypress run/open
  Files/Areas: `frontend/package.json`
  Done: Scripts include app dev run and Cypress execution commands.
  Evidence: `npm run` lists scripts; commands execute without script-not-found.
  Depends: T001

---

## Phase 2: Foundational (Blocking)

**Purpose**: Build cross-cutting auth/session/security UX foundation before feature screens.

**CRITICAL**: No CRUD screen work starts before this phase is complete.

- [ ] T005 Implement session state service for auth context
  Files/Areas: `frontend/src/app/core/auth/session.service.ts`, `frontend/src/app/shared/models/session-user.model.ts`
  Done: Session context (email/role/isAuthenticated/basicAuthHeader) is stored and cleared in session scope.
  Evidence: Unit/manual check confirms login state persists in tab session and clears on logout.
  Depends: T002, T003

- [ ] T006 Implement auth service with Basic Auth header strategy
  Files/Areas: `frontend/src/app/core/auth/auth.service.ts`
  Done: Service builds Basic Auth header and validates login against backend endpoint usage.
  Evidence: Valid credentials set session; invalid credentials return handled error.
  Depends: T005

- [ ] T007 [P] Implement auth interceptor for Authorization header injection
  Files/Areas: `frontend/src/app/core/auth/auth.interceptor.ts`, `frontend/src/app/app.config.ts`
  Done: Protected API calls include `Authorization: Basic ...` when session exists.
  Evidence: Browser network panel shows Authorization header on protected requests.
  Depends: T005, T006

- [ ] T008 [P] Implement API error interceptor for 401/403/general API errors
  Files/Areas: `frontend/src/app/core/http/api-error.interceptor.ts`, `frontend/src/app/app.config.ts`
  Done: 401 triggers session invalidation/login flow; 403 and API errors mapped to UI feedback.
  Evidence: Simulated 401/403 produce expected redirect/message behavior.
  Depends: T005

- [ ] T009 Implement AuthGuard for protected route access
  Files/Areas: `frontend/src/app/core/guards/auth.guard.ts`, `frontend/src/app/app.routes.ts`
  Done: Unauthenticated users are redirected to `/login` for protected routes.
  Evidence: Direct URL access without session redirects to login.
  Depends: T005, T002

- [ ] T010 Implement RoleGuard for ADMIN-only write routes
  Files/Areas: `frontend/src/app/core/guards/role.guard.ts`, `frontend/src/app/app.routes.ts`
  Done: Write routes (`nuevo`, `editar`) blocked for USER role.
  Evidence: USER cannot open ADMIN routes; guard returns safe redirect/block.
  Depends: T005, T009

---

## Phase 3: User Story 1 - Login, Logout and Protected Shell (P1)

**Goal**: Deliver login/logout, protected navigation, and role-aware shell baseline.

**Independent Test**: User can login/logout, navigate protected shell, and be blocked when unauthenticated.

- [ ] T011 [US1] Implement login page UI and form validation
  Files/Areas: `frontend/src/app/features/login/login.page.ts`, `frontend/src/app/features/login/login.page.html`, `frontend/src/app/features/login/login.page.scss`
  Done: Login form with required fields and basic validation messages.
  Evidence: Empty/invalid login attempts show UI feedback before request.
  Depends: T006

- [ ] T012 [US1] Wire login flow to auth service and session bootstrap
  Files/Areas: `frontend/src/app/features/login/login.page.ts`, `frontend/src/app/core/auth/auth.service.ts`
  Done: Successful login stores session and redirects to protected landing route.
  Evidence: Valid backend credentials navigate to shell.
  Depends: T011, T006

- [ ] T013 [US1] Implement protected shell layout with logout action
  Files/Areas: `frontend/src/app/layout/shell.component.ts`, `frontend/src/app/layout/shell.component.html`, `frontend/src/app/layout/topbar.component.ts`, `frontend/src/app/layout/topbar.component.html`
  Done: Shell renders protected navigation and provides logout trigger.
  Evidence: Logout clears session and returns to login screen.
  Depends: T009, T012

- [ ] T014 [US1] Configure route map for login/public and protected sections
  Files/Areas: `frontend/src/app/app.routes.ts`
  Done: `/login` public, protected routes under auth guard, default redirect defined.
  Evidence: Manual navigation confirms route behavior matrix.
  Depends: T009, T013

- [ ] T015 [US1] Add baseline login error messaging for 401 credentials failure
  Files/Areas: `frontend/src/app/features/login/login.page.ts`, `frontend/src/app/shared/components/**`
  Done: Invalid credentials show clear message without app crash.
  Evidence: Wrong credentials produce visible login error state.
  Depends: T012, T008

---

## Phase 4: User Story 2 - Empleados Views and Role-Based Actions (P2)

**Goal**: Provide empleados listing and ADMIN-only create/update/delete flows.

**Independent Test**: USER reads empleados; ADMIN reads and performs write actions.

- [ ] T016 [US2] Implement empleados API service and typed models
  Files/Areas: `frontend/src/app/features/empleados/empleados.service.ts`, `frontend/src/app/shared/models/empleado.model.ts`
  Done: Service supports list/create/update/delete operations against backend endpoints.
  Evidence: Service methods resolve expected payload/response shape.
  Depends: T007, T002

- [ ] T017 [US2] Implement empleados list page and table rendering
  Files/Areas: `frontend/src/app/features/empleados/empleados-list.page.ts`, `frontend/src/app/features/empleados/empleados-list.page.html`, `frontend/src/app/features/empleados/empleados-list.page.scss`
  Done: List page fetches and renders empleados with loading/empty states.
  Evidence: Backend data appears in UI with no runtime errors.
  Depends: T016, T013

- [ ] T018 [US2] Implement empleado form page (create/edit) with basic validations
  Files/Areas: `frontend/src/app/features/empleados/empleado-form.page.ts`, `frontend/src/app/features/empleados/empleado-form.page.html`, `frontend/src/app/features/empleados/empleado-form.page.scss`
  Done: Form supports create/edit mode and validates required fields.
  Evidence: Form submit blocked for invalid inputs; valid payload submitted.
  Depends: T016

- [ ] T019 [US2] Add ADMIN-only route protection for empleado write routes
  Files/Areas: `frontend/src/app/app.routes.ts`, `frontend/src/app/core/guards/role.guard.ts`
  Done: Empleado write routes require ADMIN role guard.
  Evidence: USER blocked on `/empleados/nuevo` and `/empleados/:clave/editar`.
  Depends: T010, T018

- [ ] T020 [US2] Reflect role-based UI actions in empleados list/form
  Files/Areas: `frontend/src/app/features/empleados/empleados-list.page.html`, `frontend/src/app/features/empleados/empleado-form.page.html`, `frontend/src/app/core/auth/session.service.ts`
  Done: Create/edit/delete controls visible for ADMIN; hidden/disabled for USER.
  Evidence: Same screen differs correctly between ADMIN and USER.
  Depends: T017, T018, T005

- [ ] T021 [US2] Implement empleado create/update/delete action handlers
  Files/Areas: `frontend/src/app/features/empleados/empleados-list.page.ts`, `frontend/src/app/features/empleados/empleado-form.page.ts`
  Done: ADMIN can execute write actions with success/error feedback.
  Evidence: Successful create/update/delete reflected in list and messages.
  Depends: T018, T020

---

## Phase 5: User Story 3 - Departamentos Views and Role-Based Actions (P3)

**Goal**: Provide departamentos listing and ADMIN-only create/update/delete flows.

**Independent Test**: USER reads departamentos; ADMIN reads and performs write actions.

- [ ] T022 [US3] Implement departamentos API service and typed models
  Files/Areas: `frontend/src/app/features/departamentos/departamentos.service.ts`, `frontend/src/app/shared/models/departamento.model.ts`
  Done: Service supports list/create/update/delete operations against backend endpoints.
  Evidence: Service methods resolve expected payload/response shape.
  Depends: T007, T002

- [ ] T023 [US3] Implement departamentos list page and table rendering
  Files/Areas: `frontend/src/app/features/departamentos/departamentos-list.page.ts`, `frontend/src/app/features/departamentos/departamentos-list.page.html`, `frontend/src/app/features/departamentos/departamentos-list.page.scss`
  Done: List page fetches and renders departamentos with loading/empty states.
  Evidence: Backend data appears in UI with no runtime errors.
  Depends: T022, T013

- [ ] T024 [US3] Implement departamento form page (create/edit) with basic validations
  Files/Areas: `frontend/src/app/features/departamentos/departamento-form.page.ts`, `frontend/src/app/features/departamentos/departamento-form.page.html`, `frontend/src/app/features/departamentos/departamento-form.page.scss`
  Done: Form supports create/edit mode and validates required fields.
  Evidence: Form submit blocked for invalid inputs; valid payload submitted.
  Depends: T022

- [ ] T025 [US3] Add ADMIN-only route protection for departamento write routes
  Files/Areas: `frontend/src/app/app.routes.ts`, `frontend/src/app/core/guards/role.guard.ts`
  Done: Departamento write routes require ADMIN role guard.
  Evidence: USER blocked on `/departamentos/nuevo` and `/departamentos/:clave/editar`.
  Depends: T010, T024

- [ ] T026 [US3] Reflect role-based UI actions in departamentos list/form
  Files/Areas: `frontend/src/app/features/departamentos/departamentos-list.page.html`, `frontend/src/app/features/departamentos/departamento-form.page.html`, `frontend/src/app/core/auth/session.service.ts`
  Done: Create/edit/delete controls visible for ADMIN; hidden/disabled for USER.
  Evidence: Same screen differs correctly between ADMIN and USER.
  Depends: T023, T024, T005

- [ ] T027 [US3] Implement departamento create/update/delete action handlers
  Files/Areas: `frontend/src/app/features/departamentos/departamentos-list.page.ts`, `frontend/src/app/features/departamentos/departamento-form.page.ts`
  Done: ADMIN can execute write actions with success/error feedback, including backend conflict messages.
  Evidence: Successful create/update/delete reflected in list and messages.
  Depends: T024, T026

---

## Phase 6: Cross-Cutting API Error Handling and UX Safety

**Purpose**: Consolidate API error behavior expected in minimum scope.

- [ ] T028 Map and display 401/403/API errors in reusable feedback component
  Files/Areas: `frontend/src/app/shared/components/api-feedback/**`, `frontend/src/app/core/http/api-error.interceptor.ts`
  Done: Common UI feedback shown for auth/authorization/api errors.
  Evidence: Triggered 401/403/400/409 scenarios show consistent messages.
  Depends: T008, T015

- [ ] T029 Handle unauthorized session invalidation and safe redirect
  Files/Areas: `frontend/src/app/core/auth/session.service.ts`, `frontend/src/app/core/http/api-error.interceptor.ts`, `frontend/src/app/app.routes.ts`
  Done: On backend 401 during session, user is logged out and redirected to login.
  Evidence: Simulated expired session results in controlled redirect.
  Depends: T008, T005

---

## Phase 7: User Story 4 - Cypress Minimum E2E (P4)

**Goal**: Deliver minimum critical E2E suite for login, protected navigation, role reflection per domain, USER write rejection, and CRUD smoke for ADMIN.

**Independent Test**: Cypress run validates minimum set of agreed scenarios with reproducible pass/fail output.

- [ ] T030 [US4] Configure Cypress baseline
  Files/Areas: `frontend/cypress.config.ts`, `frontend/cypress/support/e2e.ts`, `frontend/package.json`
  Done: Cypress is configured with base URL and runnable scripts.
  Evidence: `npx cypress run` starts test runner without config errors.
  Depends: T004

- [ ] T031 [US4] Implement E2E spec for login success and login failure
  Files/Areas: `frontend/cypress/e2e/login.cy.ts`
  Done: Test validates valid credentials enter protected shell and invalid credentials stay on login with clear error.
  Evidence: Spec passes consistently with backend running.
  Depends: T030, T012, T015

- [ ] T032 [US4] Implement E2E spec for protected navigation behavior
  Files/Areas: `frontend/cypress/e2e/protected-navigation.cy.ts`
  Done: Test validates unauthenticated route access redirection to login.
  Evidence: Spec passes for direct protected URL attempts.
  Depends: T030, T009, T014

- [ ] T033 [US4] Implement E2E spec for role visibility/restriction in empleados
  Files/Areas: `frontend/cypress/e2e/empleados-role-visibility.cy.ts`
  Done: Test validates ADMIN sees empleados write actions and USER does not.
  Evidence: Spec passes for both role sessions in empleados module.
  Depends: T030, T020

- [ ] T034 [US4] Implement E2E spec for role visibility/restriction in departamentos
  Files/Areas: `frontend/cypress/e2e/departamentos-role-visibility.cy.ts`
  Done: Test validates ADMIN sees departamentos write actions and USER does not.
  Evidence: Spec passes for both role sessions in departamentos module.
  Depends: T030, T026

- [ ] T035 [US4] Implement E2E spec for USER forced write rejection by backend
  Files/Areas: `frontend/cypress/e2e/user-write-forbidden.cy.ts`
  Done: Test validates USER forced write attempt is rejected by backend (`403`) and frontend shows controlled feedback.
  Evidence: Spec passes with explicit backend denial assertion.
  Depends: T030, T019, T025, T028

- [X] T036 [US4] Implement E2E spec for ADMIN CRUD smoke in empleados
  Files/Areas: `frontend/cypress/e2e/empleados-admin-crud-smoke.cy.ts`
  Done: Test validates create, update, and delete smoke path for empleados by ADMIN.
  Evidence: Spec passes and list reflects CRUD transitions.
  Depends: T030, T021

- [X] T037 [US4] Implement E2E spec for ADMIN CRUD smoke in departamentos
  Files/Areas: `frontend/cypress/e2e/departamentos-admin-crud-smoke.cy.ts`
  Done: Test validates create, update, and delete smoke path for departamentos by ADMIN.
  Evidence: Spec passes and list reflects CRUD transitions.
  Depends: T030, T027

---

## Phase 8: Integration, Optional Minimal Backend Adjustment, and Final Validation

**Purpose**: Verify frontend-backend integration and ensure backend no-regression.

- [ ] T038 Verify integration with backend endpoints and environment base URL
  Files/Areas: `frontend/src/environments/environment.ts`, `frontend/src/app/features/**`, `specs/005-angular-frontend-login-empleados-departamentos/quickstart.md`
  Done: Frontend works against backend local URL and all minimum scope flows execute.
  Evidence: Quickstart steps complete successfully in local run.
  Depends: T021, T027, T029

- [ ] T039 [P] Apply minimal backend CORS adjustment only if strictly required
  Files/Areas: `backend/src/main/java/com/dsw02/empleados/config/**` (only if needed)
  Done: If cross-origin blocks occur, backend allows frontend origin and Authorization header with minimal change.
  Evidence: No CORS errors in browser for frontend API calls; backend behavior unchanged.
  Depends: T038

- [ ] T040 Validate backend no-regression after frontend integration
  Files/Areas: `backend/` runtime behavior (no structural code change expected)
  Done: Existing backend auth/roles/CRUD behavior remains intact.
  Evidence: Manual smoke checks for existing backend endpoints still pass (e.g., empleados/departamentos CRUD and role behavior).
  Depends: T038, T039

- [ ] T041 Capture explicit 401/403 handling evidence from integrated frontend runtime
  Files/Areas: `frontend/src/app/core/http/api-error.interceptor.ts`, `frontend/src/app/shared/components/api-feedback/**`, `specs/005-angular-frontend-login-empleados-departamentos/quickstart.md`
  Done: Evidence demonstrates 401 session invalidation/redirect and 403 feedback behavior against real backend.
  Evidence: Quickstart includes reproducible steps and observed expected outcomes for 401 and 403.
  Depends: T028, T029, T038

- [ ] T042 Capture explicit pagination/listing evidence consumed from frontend
  Files/Areas: `frontend/src/app/features/empleados/empleados.service.ts`, `frontend/src/app/features/departamentos/departamentos.service.ts`, `specs/005-angular-frontend-login-empleados-departamentos/quickstart.md`
  Done: Evidence confirms frontend consumes paginated listing responses and renders page transitions.
  Evidence: Quickstart includes `page,size,sort` verification steps with expected UI/list changes.
  Depends: T017, T023, T038

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 (Setup): starts immediately.
- Phase 2 (Foundational): depends on Setup and blocks feature stories.
- Phase 3 (US1): depends on Foundational.
- Phase 4 (US2): depends on US1 foundation and core services.
- Phase 5 (US3): depends on US1 foundation and core services.
- Phase 6 (Cross-Cutting Errors): depends on core and feature routes.
- Phase 7 (US4 E2E): depends on implemented UI flows.
- Phase 8 (Integration/Validation): final verification, explicit quality-gate evidence, and optional minimal CORS.

### Parallel Opportunities

- T003 and T004 can run in parallel after T001.
- T007 and T008 can run in parallel after T005/T006 baseline.
- T016 and T022 can run in parallel (service layers per domain).
- T017 and T023 can run in parallel (list views per domain).
- T018 and T024 can run in parallel (form pages per domain).
- T032-T037 can run in parallel after T030 and required UI readiness.
- T039 can run in parallel with final frontend validation only if CORS issue is detected.

## Implementation Strategy

### MVP First

1. Complete Phases 1 and 2.
2. Deliver US1 (login/logout/protected routing).
3. Deliver US2 + US3 core CRUD screens.
4. Add minimal E2E suite (US4) with role split, USER-forced-write denial, and CRUD smoke by domain.
5. Validate integration and backend no-regression.

### Safety Rules

- Do not restructure backend.
- Keep Basic Auth as-is.
- No frontend Docker in minimum scope.
- Backend changes allowed only when strictly necessary (minimal CORS).
- Do not introduce JWT, refresh tokens, SSR, PWA, or major security refactors.
