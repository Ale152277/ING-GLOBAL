import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';
import { Venta, FiltrosVenta, Pagina } from '../../models/venta.model';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private apiUrl = `${environment.apiUrl}/api/v1/ventas`;

  constructor(private http: HttpClient) {}

  crearVenta(): Observable<ApiResponse<Venta>> {
    return this.http.post<ApiResponse<Venta>>(this.apiUrl, {});
  }

  obtenerMisVentas(
    page: number = 0,
    size: number = 6,
    filtros?: FiltrosVenta,
  ): Observable<ApiResponse<Pagina<Venta>>> {
    let params = new HttpParams().set('page', page).set('size', size);

    if (filtros?.estado) {
      params = params.set('estado', filtros.estado);
    }

    if (filtros?.fechaDesde) {
      params = params.set('fechaDesde', filtros.fechaDesde);
    }

    if (filtros?.fechaHasta) {
      params = params.set('fechaHasta', filtros.fechaHasta);
    }

    if (filtros?.precioMin !== null && filtros?.precioMin !== undefined) {
      params = params.set('precioMin', filtros.precioMin.toString());
    }

    if (filtros?.precioMax !== null && filtros?.precioMax !== undefined) {
      params = params.set('precioMax', filtros.precioMax.toString());
    }

    return this.http.get<ApiResponse<Pagina<Venta>>>(
      this.apiUrl,
      { params }
    );
  }
}
