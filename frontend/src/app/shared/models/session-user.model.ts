export type UserRole = 'ADMIN' | 'USER';

export interface SessionUser {
  email: string;
  role: UserRole;
  basicAuthHeader: string;
  isAuthenticated: boolean;
}
