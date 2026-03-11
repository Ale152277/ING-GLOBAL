import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../../models/producto.model';
import { PageResponse, ApiResponse } from '../../../models/api-response.model';
import { CrearProductoRequest, EditarProductoRequest } from '../../../models/crearProductoRequest';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private apiUrl = `${environment.apiUrl}/api/v1/productos`;

  constructor(private http: HttpClient) {}

  obtenerProductos(
    page: number = 1,
    size: number = 12,
    categoriaId?: number,
    marcaId?: number,
    precioMin?: number,
    precioMax?: number,
    soloStock: boolean = false,
    ordenar?: string,
    estado?: string
  ): Observable<ApiResponse<PageResponse<Producto>>> {
    let params = new HttpParams();
    params = params.set('page', page);
    params = params.set('size', size);
    params = params.set('soloStock', soloStock);

    if (categoriaId) params = params.set('categoriaId', categoriaId);
    if (marcaId) params = params.set('marcaId', marcaId);
    if (precioMin) params = params.set('precioMin', precioMin);
    if (precioMax) params = params.set('precioMax', precioMax);
    if (ordenar) params = params.set('ordenar', ordenar);
    if(estado) params = params.set('estado',estado)

    return this.http.get<ApiResponse<PageResponse<Producto>>>(this.apiUrl, { params });
  }

  obtenerProductoPorId(id: number): Observable<ApiResponse<Producto>> {
    return this.http.get<ApiResponse<Producto>>(`${this.apiUrl}/${id}`);
  }

  buscarProductos(
    termino: string,
    page: number = 1,
    size: number = 12,
  ): Observable<ApiResponse<PageResponse<Producto>>> {
    let params = new HttpParams();
    params = params.set('q', termino);
    params = params.set('page', page);
    params = params.set('size', size);

    return this.http.get<ApiResponse<PageResponse<Producto>>>(`${this.apiUrl}/buscar`,{params});
  }

  obtenerPorEtiqueta(
    etiqueta: string,
    page: number = 1,
    size: number = 12,
  ): Observable<ApiResponse<PageResponse<Producto>>> {
    let params = new HttpParams();
    params = params.set('page', page);
    params = params.set('size', size);
    return this.http.get<ApiResponse<PageResponse<Producto>>>(
      `${this.apiUrl}/etiqueta/${etiqueta}`,
      { params },
    );
  }

  obtenerOfertas(
    page: number = 1,
    size: number = 12,
  ): Observable<ApiResponse<PageResponse<Producto>>> {
    let params = new HttpParams();
    params = params.set('page', page);
    params = params.set('size', size);

    return this.http.get<ApiResponse<PageResponse<Producto>>>(`${this.apiUrl}/ofertas`, { params });
  }

  crearProducto(data: CrearProductoRequest): Observable<ApiResponse<Producto>>{
    console.log('CREANDO PRUDCTO:', data.nombre);
    return this.http.post<ApiResponse<Producto>>(this.apiUrl, data);
  }

  editarProducto(id:number, data: EditarProductoRequest): Observable<ApiResponse<Producto>>{
    console.log('EDITANDO PRUDCTO ID:', id, data.nombre);
    return this.http.put<ApiResponse<Producto>>(`${this.apiUrl}/${id}`, data);
  }

  eliminarProducto( id:number): Observable<ApiResponse<null>>{
    console.log('ELIMINANDO PRUDCTO ID:', id);
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

  cambiarEstado(id: number, estado: string): Observable<ApiResponse<Producto>> {
  let params = new HttpParams();
  params = params.set('estado', estado);
  return this.http.patch<ApiResponse<Producto>>(`${this.apiUrl}/${id}/estado`, null, { params });
}
  
  obtenerTodosParaAdmin(
    page:number =1,
    size: number=20
  ): Observable<ApiResponse<PageResponse<Producto>>>{
    let params = new HttpParams();
    params = params.set('page', page);
    params = params.set('size', size);
    params = params.set('estado','ACTIVO')

    return this.http.get<ApiResponse<PageResponse<Producto>>>(`${this.apiUrl}/admin/todos`, {params});
  }
}
