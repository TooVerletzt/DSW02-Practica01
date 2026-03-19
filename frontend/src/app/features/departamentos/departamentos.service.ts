import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Departamento, DepartamentoPayload } from '../../shared/models/departamento.model';
import { PageResponse } from '../../shared/models/page-response.model';

@Injectable({ providedIn: 'root' })
export class DepartamentosService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/v1/departamentos`;

  constructor(private readonly http: HttpClient) {}

  list(page = 0, size = 10, sort = 'clave,asc'): Observable<PageResponse<Departamento>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);

    return this.http.get<PageResponse<Departamento>>(this.apiUrl, { params });
  }

  getByClave(clave: string): Observable<Departamento> {
    return this.http.get<Departamento>(`${this.apiUrl}/${clave}`);
  }

  create(payload: DepartamentoPayload): Observable<Departamento> {
    return this.http.post<Departamento>(this.apiUrl, payload);
  }

  update(clave: string, payload: DepartamentoPayload): Observable<Departamento> {
    return this.http.put<Departamento>(`${this.apiUrl}/${clave}`, payload);
  }

  delete(clave: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${clave}`);
  }
}
