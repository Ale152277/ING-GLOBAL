import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { ApiResponse } from '../../../../shared/models/api-response.model';
import { Pagina } from '../../../../models/venta.model';
import { AdminPedido, EstadoPedidoAdmin, AdminPedidoDetalle } from '../model/admin-order.model';

@Injectable({
  providedIn: 'root',
})
export class AdminOrdersService {
  private apiUrl = `${environment.apiUrl}/api/v1/admin/ventas`;

  constructor(private http: HttpClient) {}

  obtenerPedidos(
    page: number = 0,
    size: number = 10,
    estado?: EstadoPedidoAdmin,
  ): Observable<ApiResponse<Pagina<AdminPedido>>> {
    let params = new HttpParams().set('page', page).set('size', size);

    if (estado) {
      params = params.set('estado', estado);
    }

    return this.http.get<ApiResponse<Pagina<AdminPedido>>>(this.apiUrl, { params });
  }

  actualizarEstado(id: number, estado: EstadoPedidoAdmin): Observable<ApiResponse<AdminPedido>> {
    return this.http.patch<ApiResponse<AdminPedido>>(`${this.apiUrl}/${id}/estado`, { estado });
  }

  obtenerPedidoPorId(id: number): Observable<ApiResponse<AdminPedidoDetalle>> {
    return this.http.get<ApiResponse<AdminPedidoDetalle>>(`${this.apiUrl}/${id}`);
  }
}
