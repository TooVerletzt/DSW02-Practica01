# Quickstart: Frontend Angular 22 + Existing Backend (Minimum Scope)

## Prerequisites
- Backend service running and reachable (default `http://localhost:8080`)
- Node.js LTS and npm installed
- Angular CLI compatible with Angular 22

## 1) Create and run frontend

```bash
cd frontend
npm install
npm start
```

Expected:
- Frontend available in local dev origin (for example `http://localhost:4200`)
- Login page rendered

## 2) Validate login success and protected routing

- Open frontend login page.
- Login using valid backend credentials:
  - `admin@demo.com / admin123`
  - `user@demo.com / user123`

Expected:
- Successful login navigates to protected shell.
- Direct access to protected routes without session redirects to login.

## 3) Validate role-reflective UI behavior

### As ADMIN
- Access empleados and departamentos views.
- Verify create/edit/delete actions are visible.

### As USER
- Access empleados and departamentos views.
- Verify create/edit/delete actions are hidden or disabled.

## 4) Validate basic CRUD smoke flows (ADMIN)

- Create one departamento with minimum valid payload.
- Update that departamento and then delete it.
- Create one empleado with minimum valid payload.
- Update that empleado and then delete it.

Expected:
- Success feedback shown in UI.
- Records are visible after create/update and no longer visible after delete.

## 5) Validate baseline error handling and backend authority

- Attempt login with invalid credentials.
- Trigger one forbidden action path as USER.
- While authenticated, force an invalid session (logout in another tab or clear `sessionStorage`) and trigger one protected API request.

Expected:
- Invalid login displays error message.
- Forbidden action displays authorization feedback and keeps backend authority (`403`).
- Invalid/expired session forces redirect to login (`401` handling).

## 6) Validate pagination consumption in frontend

- In empleados and departamentos list screens, move between pages using `Anterior/Siguiente` controls.
- Verify network calls include `page`, `size`, and `sort` query params.

Expected:
- UI updates to the requested page index.
- Table content changes according to page transitions.

## 7) Run Cypress minimum E2E

```bash
cd frontend
npx cypress run
```

Minimum expected suite includes:
- login (success/failure)
- protected navigation
- role visibility in empleados
- role visibility in departamentos
- user forced write forbidden (`403`)
- admin CRUD smoke in empleados
- admin CRUD smoke in departamentos

## Notes
- Frontend Docker is intentionally out of minimum scope.
- Backend changes are not required except minimal CORS allowance if local origins differ.
