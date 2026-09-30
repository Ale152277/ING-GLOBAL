import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Carrito, DetalleCarrito, AgregarAlCarrito } from '../../../models/carrito.model';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private apiUrl = `${environment.apiUrl}/api/v1/carrito`;

  private carritoSubjetc = new BehaviorSubject<Carrito | null>(null);
  public carrito$ = this.carritoSubjetc.asObservable();

  constructor(private http: HttpClient) {}

  obtenerCarrito(): Observable<ApiResponse<Carrito | null>> {
    return this.http.get<ApiResponse<Carrito | null>>(this.apiUrl);
  }

  agregarProducto(request: AgregarAlCarrito): Observable<ApiResponse<Carrito>> {
    return this.http
      .post<ApiResponse<Carrito>>(`${this.apiUrl}/agregar`, request)
      .pipe(
        tap((response) => {
          if (response.data) {
            this.carritoSubjetc.next(response.data);
          }
        }),
      );
  }

  eliminarProducto(detalleId: number, carritoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/detalle/${detalleId}?carritoId=${carritoId}`);
  }

  varciarCarrito(carritoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${carritoId}/vaciar`);
  }

  enviarWhatsapp(carritoId: number): Observable<ApiResponse<Carrito>> {
    return this.http.post<ApiResponse<Carrito>>(`${this.apiUrl}/${carritoId}/enviar-whatsapp`, {});
  }

  obtenerCantidadProductos(carrito: Carrito): number {
    if (!carrito || !carrito.detalles) {
      return 0;
    }
    return carrito.detalles.reduce((total, detalle) => total + detalle.cantidad, 0);
  }

  obtenerTotal(carrito: Carrito): number {
    if (!carrito || !carrito.detalles) {
      return 0;
    }
    return carrito.detalles.reduce((total, detalle) => total + detalle.subtotal, 0);
  }

  actualizarCantidad(
    detalleId: number,
    carritoId: number,
    cantidad: number,
  ): Observable<ApiResponse<Carrito>> {
    return this.http
      .put<
        ApiResponse<Carrito>
      >(`${this.apiUrl}/detalle/${detalleId}?cantidad=${cantidad}&carritoId=${carritoId}`, {})
      .pipe(
        tap((response: ApiResponse<Carrito>) => {
          if (response.data) {
            this.carritoSubjetc.next(response.data);
          }
        }),
      );
  }

  actualizarBehaviorSubject(carrito: Carrito): void {
    this.carritoSubjetc.next({ ...carrito, detalles: [...carrito.detalles] });
  }

  limpiarCarritoLocal():void{
    this.carritoSubjetc.next(null);
  }

  
}