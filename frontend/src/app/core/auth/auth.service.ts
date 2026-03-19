import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Empleado } from '../../shared/models/empleado.model';
import { PageResponse } from '../../shared/models/page-response.model';
import { SessionService } from './session.service';
import { SessionUser, UserRole } from '../../shared/models/session-user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/v1/empleados`;

  constructor(
    private readonly http: HttpClient,
    private readonly sessionService: SessionService
  ) {}

  login(email: string, password: string): Observable<SessionUser> {
    const normalizedEmail = email.trim().toLowerCase();
    const basicAuthHeader = this.buildBasicAuthHeader(normalizedEmail, password);

    return this.resolveRole(normalizedEmail, basicAuthHeader, 0).pipe(
      map((role) => {
        const session: SessionUser = {
          email: normalizedEmail,
          role,
          basicAuthHeader,
          isAuthenticated: true
        };

        this.sessionService.setSession(session);
        return session;
      })
    );
  }

  logout(): void {
    this.sessionService.clearSession();
  }

  private resolveRole(email: string, basicAuthHeader: string, page: number): Observable<UserRole> {
    const headers = new HttpHeaders({ Authorization: basicAuthHeader });
    const params = new HttpParams()
      .set('page', page)
      .set('size', 50)
      .set('sort', 'clave,asc');

    return this.http.get<PageResponse<Empleado>>(this.apiUrl, { headers, params }).pipe(
      switchMap((response) => {
        const self = response.content.find((empleado) => empleado.email?.toLowerCase() === email);
        if (self?.role) {
          return of(self.role);
        }

        if (page + 1 < response.totalPages) {
          return this.resolveRole(email, basicAuthHeader, page + 1);
        }

        return throwError(() => new Error('No se pudo resolver el rol del usuario autenticado'));
      })
    );
  }

  private buildBasicAuthHeader(email: string, password: string): string {
    return `Basic ${btoa(`${email}:${password}`)}`;
  }
}
