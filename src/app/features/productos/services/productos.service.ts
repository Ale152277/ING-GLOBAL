import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../../models/producto.model';
import { PageResponse, ApiResponse } from '../../../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private apiUrl = 'http://localhost:8080/api/v1/productos';

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
}
