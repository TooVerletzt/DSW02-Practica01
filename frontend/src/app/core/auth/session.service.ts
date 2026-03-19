import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SessionUser, UserRole } from '../../shared/models/session-user.model';

const SESSION_KEY = 'empleados.session';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly sessionSubject = new BehaviorSubject<SessionUser | null>(this.restoreSession());

  readonly session$ = this.sessionSubject.asObservable();

  get session(): SessionUser | null {
    return this.sessionSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.session?.isAuthenticated;
  }

  get role(): UserRole | null {
    return this.session?.role ?? null;
  }

  hasRole(role: UserRole): boolean {
    return this.role === role;
  }

  setSession(session: SessionUser): void {
    this.sessionSubject.next(session);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  clearSession(): void {
    this.sessionSubject.next(null);
    sessionStorage.removeItem(SESSION_KEY);
  }

  private restoreSession(): SessionUser | null {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as SessionUser;
      if (!parsed?.basicAuthHeader || !parsed?.email || !parsed?.role) {
        return null;
      }
      return {
        ...parsed,
        isAuthenticated: true
      };
    } catch {
      return null;
    }
  }
}
