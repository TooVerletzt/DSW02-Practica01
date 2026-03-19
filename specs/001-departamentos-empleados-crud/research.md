# Research: CRUD Departamentos y Empleados

## Decision 1: Integridad referencial para relacion Empleado -> Departamento
- Decision: Usar FK nullable `empleados.departamento_clave -> departamentos.clave`.
- Rationale: Permite relacion opcional y evita referencias a departamentos inexistentes a nivel BD.
- Alternatives considered:
  - Sin FK y validar solo en servicio.
  - Join table para una relacion 1:1 opcional.

## Decision 2: Regla de borrado con conflicto 409
- Decision: Antes de borrar departamento, verificar existencia de empleados asociados y responder `409` si hay asignaciones.
- Rationale: Cumple requisito funcional y evita borrado destructivo con datos dependientes.
- Alternatives considered:
  - Borrado en cascada.
  - Set null automatico en FK durante delete.

## Decision 3: Estrategia de paginacion y validacion
- Decision: Reutilizar convenciones actuales (`page`, `size`, `sort`) con validaciones (`page>=0`, `1<=size<=100`, `sort` valido).
- Rationale: Consistencia con comportamiento de API existente y menor riesgo de regresion.
- Alternatives considered:
  - Paginacion sin validacion estricta.
  - Cursor-based pagination para departamentos.

## Decision 4: Errores estandar para 400 y 409
- Decision: Reutilizar el formato de error estandar (`timestamp,status,error,message,path`) para `400` (departamento inexistente en empleado) y `409` (delete bloqueado).
- Rationale: Contrato uniforme para clientes y compatibilidad con el manejo actual de excepciones.
- Alternatives considered:
  - Formato de error distinto para reglas de negocio de departamentos.
  - Mensajes sin estructura JSON estandar.

## Decision 5: Seguridad y operacion sin cambios estructurales
- Decision: Mantener Basic Auth por BD, reglas por rol existentes, health publico, Swagger Authorize, y runtime Docker de 2 contenedores.
- Rationale: Cumplimiento constitucional y alcance incremental solicitado.
- Alternatives considered:
  - Ajustes de esquema de autenticacion (JWT, endpoint de login dedicado).
  - Cambios de topologia de runtime/contenedores.
