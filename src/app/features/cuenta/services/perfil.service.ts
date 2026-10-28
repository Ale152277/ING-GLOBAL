import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Usuario } from '../../../models/usuario.model';
import { ApiResponse } from '../../../shared/models/api-response.model';

export interface ActualizarPerfilRequest {
  nombreCompleto: string;
  telefono: string;
}

export interface CambiarContrasenaRequest {
  contrasenaActual: string;
  contrasenaNueva: string;
}

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private apiUrl = `${environment.apiUrl}/api/v1/usuario/me`;

  constructor(private http: HttpClient) {}

  obtenerPerfil(): Observable<ApiResponse<Usuario>> {
    return this.http.get<ApiResponse<Usuario>>(this.apiUrl);
  }

  actualizarPerfil(request: ActualizarPerfilRequest): Observable<ApiResponse<Usuario>> {
    return this.http.put<ApiResponse<Usuario>>(this.apiUrl, request);
  }

  cambiarContrasena(request: CambiarContrasenaRequest):Observable<ApiResponse<void>>{
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/contrasena`, request);
  }
}
