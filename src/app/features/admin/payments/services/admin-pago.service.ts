import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiResponse } from '../../../../shared/models/api-response.model';
import { AdminPago } from '../../../pagos/models/pago.model';

@Injectable({
  providedIn: 'root',
})
export class AdminPagoService {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/admin/pagos`;

  constructor(private http: HttpClient) {}

  obtenerPagos(): Observable<ApiResponse<AdminPago[]>> {
    return this.http.get<ApiResponse<AdminPago[]>>(this.apiUrl);
  }

  obtenerPagosEnRevision(): Observable<ApiResponse<AdminPago[]>> {
    return this.http.get<ApiResponse<AdminPago[]>>(`${this.apiUrl}/revision`);
  }

  obtenerComprobante(pagoId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${pagoId}/comprobante`, {
      responseType: 'blob',
    });
  }

  aprobarPago(pagoId: number): Observable<ApiResponse<AdminPago>> {
    return this.http.patch<ApiResponse<AdminPago>>(`${this.apiUrl}/${pagoId}/aprobar`, {});
  }

  rechazarPago(pagoId: number, motivo: string): Observable<ApiResponse<AdminPago>> {
    return this.http.patch<ApiResponse<AdminPago>>(
      `${this.apiUrl}/${pagoId}/rechazar`,
      { motivo },
    );
  }
}
