import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Carrito, DetalleCarrito } from '../../../models/carrito.model';
import { ApiResponse } from '../../../models/api-response.model';
import { AgregarAlCarrito } from '../../../models/carrito.model';


@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  
  private apiUrl = 'http://localhost:8080/api/v1/carrito';

  private carritoSubjetc = new BehaviorSubject<Carrito | null>(null);
  public carrito$ = this.carritoSubjetc.asObservable();

  constructor(private http: HttpClient) {}

  obtenerCarrito(usuarioId: number): Observable<ApiResponse<Carrito>> {
    return this.http.get<ApiResponse<Carrito>>(`${this.apiUrl}/${usuarioId}`);
  }

  agregarProducto(usuarioId:number, request:AgregarAlCarrito):Observable<ApiResponse<Carrito>>{
    return this.http.post<ApiResponse<Carrito>>(`${this.apiUrl}/${usuarioId}/agregar`, request);
  }

  eliminarProducto(detalleId:number, carritoId:number):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/detalle/${detalleId}?carritoId=${carritoId}`)
  }
  

  varciarCarrito(carritoId:number):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${carritoId}/vaciar`);
  }

  enviarWhatsapp(carritoId:number):Observable<ApiResponse<Carrito>>{
    return this.http.post<ApiResponse<Carrito>>(`${this.apiUrl}/${carritoId}/enviar-whatsapp`,{});
  }

  obtenerCantidadProductos(carrito:Carrito):number{
    if(!carrito || !carrito.detalles){
      return 0;
    }
    return carrito.detalles.reduce((total, detalle)=> total + detalle.cantidad, 0)
  }

  obtenerTotal(carrito:Carrito):number{
    if(!carrito || !carrito.detalles){
      return 0;
    }
    return carrito.detalles.reduce((total, detalle)=> total + detalle.subtotal, 0)
  }

  generarURLWhatsapp(carrito:Carrito, numeroEmpresa: string = '51984115299'):string{
    let mensaje = '*Mi carrito de compras*\n\n';

    if(carrito.detalles && carrito.detalles.length > 0){
      carrito.detalles.forEach((detalle, index)=>{
        mensaje += `${index + 1}. ${detalle.producto?.nombre || 'Producto'}\n`;
        mensaje += `   Cantidad: ${detalle.cantidad}\n`;
        mensaje += `   Precio Unitario: S/ ${detalle.precioUnitario.toFixed(2)}\n`;
        if(detalle.descuento >0){
          mensaje += `Descuento: ${detalle.descuento}%\n`;

        }
        mensaje += `Subtotal: S/ ${detalle.subtotal.toFixed(2)}\n\n`;
      })
    }
    const total = this.obtenerTotal(carrito);
    mensaje += `*Total: S/ ${total.toFixed(2)}*\n`;
    mensaje += '\nPor favor confirmar mi pedido';

    const urlWhtatsapp = `https://wa.me/${numeroEmpresa}?text=${encodeURIComponent(mensaje)}`;
    return urlWhtatsapp;
  }
}
