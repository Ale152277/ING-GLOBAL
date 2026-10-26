import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { Pago } from '../models/pago.model';

@Injectable({
  providedIn: 'root',
})
export class PagoService {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/pagos`;

  constructor(private http: HttpClient) {}

  obtenerPago(pagoId: Number): Observable<ApiResponse<Pago>> {
    return this.http.get<ApiResponse<Pago>>(`${this.apiUrl}/${pagoId}`);
  }

  obtenerPagosDeVenta(ventaId: Number): Observable<ApiResponse<Pago[]>> {
    return this.http.get<ApiResponse<Pago[]>>(`${this.apiUrl}/venta/${ventaId}`);
  }

  subirComprobante(pagoId: Number, archivo: File): Observable<ApiResponse<Pago>> {
    const formData = new FormData();

    formData.append('archivo', archivo);

    return this.http.post<ApiResponse<Pago>>(`${this.apiUrl}/${pagoId}/comprobante`, formData);
  }
}
