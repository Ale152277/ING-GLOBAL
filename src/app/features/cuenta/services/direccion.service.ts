import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { Direccion, DireccionRequest } from '../../../models/direccion.model';

@Injectable({
  providedIn: 'root',
})
export class DireccionService {
  private apiUrl = `${environment.apiUrl}/api/v1/direcciones`;

  constructor(private http: HttpClient) {}

  listar(): Observable<ApiResponse<Direccion[]>> {
    return this.http.get<ApiResponse<Direccion[]>>(this.apiUrl);
  }

  crear(request: DireccionRequest): Observable<ApiResponse<Direccion>> {
    return this.http.post<ApiResponse<Direccion>>(this.apiUrl, request);
  }

  actualizar(id: number, request: DireccionRequest): Observable<ApiResponse<Direccion>> {
    return this.http.put<ApiResponse<Direccion>>(`${this.apiUrl}/${id}`, request);
  }

  eliminar(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  establecerPredeterminada(id: number): Observable<ApiResponse<Direccion>> {
    return this.http.put<ApiResponse<Direccion>>(`${this.apiUrl}/${id}/predeterminada`, {});
  }
}
