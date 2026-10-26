import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap, throwError } from 'rxjs';

import { Categoria } from '../../../models/categoria.model';
import { Marca } from '../../../models/marca.model';
import { ApiResponse, PageResponse } from '../../../shared/models/api-response.model';
import {
  CrearProductoRequest,
  EditarProductoRequest,
} from '../../productos/models/crearProductoRequest';
import { Producto } from '../../productos/models/producto.model';
import { CategoriaService } from '../../productos/services/categoria.service';
import { MarcaService } from '../../productos/services/marca.service';
import { ProductosService } from '../../productos/services/productos.service';

@Injectable({
  providedIn: 'root',
})
export class ProductoAdminService {
  constructor(
    private productosService: ProductosService,
    private categoriaService: CategoriaService,
    private marcaService: MarcaService,
  ) {}

  obtenerProductos(
    page: number,
    size: number,
  ): Observable<ApiResponse<PageResponse<Producto>>> {
    return this.productosService.obtenerTodosParaAdmin(page, size);
  }

  obtenerCatalogos(): Observable<{ categorias: Categoria[]; marcas: Marca[] }> {
    return forkJoin({
      categorias: this.categoriaService.obtenerTodas(),
      marcas: this.marcaService.obtenerTodas(),
    }).pipe(
      map(({ categorias, marcas }) => ({
        categorias: categorias.data ?? [],
        marcas: marcas.data ?? [],
      })),
    );
  }

  guardar(
    producto: Producto | null,
    request: CrearProductoRequest,
    archivo: File | null,
  ): Observable<ApiResponse<Producto>> {
    if (!archivo) {
      return this.persistir(producto, request);
    }

    return this.productosService.subirImagen(archivo).pipe(
      switchMap((response) => {
        if (!response.success || !response.data) {
          return throwError(() => new Error('No se pudo subir la imagen.'));
        }

        return this.persistir(producto, {
          ...request,
          imagen: response.data,
        });
      }),
    );
  }

  cambiarEstado(producto: Producto): Observable<ApiResponse<Producto>> {
    const estado = producto.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    return this.productosService.cambiarEstado(producto.id, estado);
  }

  private persistir(
    producto: Producto | null,
    request: CrearProductoRequest,
  ): Observable<ApiResponse<Producto>> {
    if (!producto) {
      return this.productosService.crearProducto(request);
    }

    const editar: EditarProductoRequest = {
      ...request,
      id: producto.id,
    };

    return this.productosService.editarProducto(producto.id, editar);
  }
}
