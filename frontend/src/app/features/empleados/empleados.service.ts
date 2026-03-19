import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Empleado, EmpleadoPayload } from '../../shared/models/empleado.model';
import { PageResponse } from '../../shared/models/page-response.model';

@Injectable({ providedIn: 'root' })
export class EmpleadosService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/v1/empleados`;

  constructor(private readonly http: HttpClient) {}

  list(page = 0, size = 10, sort = 'clave,asc'): Observable<PageResponse<Empleado>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);

    return this.http.get<PageResponse<Empleado>>(this.apiUrl, { params });
  }

  getByClave(clave: string): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}/${clave}`);
  }

  create(payload: EmpleadoPayload): Observable<Empleado> {
    return this.http.post<Empleado>(this.apiUrl, payload);
  }

  update(clave: string, payload: EmpleadoPayload): Observable<Empleado> {
    return this.http.put<Empleado>(`${this.apiUrl}/${clave}`, payload);
  }

  delete(clave: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${clave}`);
  }
}
