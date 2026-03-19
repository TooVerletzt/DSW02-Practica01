import { UserRole } from './session-user.model';

export interface Empleado {
  clave: string;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  role: UserRole;
  departamentoClave: string | null;
}

export interface EmpleadoPayload {
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  password: string;
  role: UserRole;
  departamentoClave: string | null;
}
