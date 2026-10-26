import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { Categoria } from '../../models/categoria.model';
import { Marca } from '../../models/marca.model';
import { Producto } from '../productos/models/producto.model';
import { CategoriaService } from '../productos/services/categoria.service';
import { MarcaService } from '../productos/services/marca.service';
import { ProductosService } from '../productos/services/productos.service';
import {
  ProductoGuardarEvento,
  ProductoModal,
} from './components/producto-modal/producto-modal';
import { ProductoAdminService } from './services/producto-admin.service';

@Component({
  selector: 'app-productos-admin',
  imports: [CommonModule, ProductoModal],
  templateUrl: './productos-admin.html',
  styleUrl: './productos-admin.css',
})
export class ProductosAdmin implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  marcas: Marca[] = [];

  isLoading = false;
  guardando = false;

  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  mostrarModal = false;
  isEditando = false;
  productoSeleccionado: Producto | null = null;

  mensaje: { tipo: 'success' | 'danger' | 'info'; texto: string } | null = null;

  constructor(
    private productosService: ProductosService,
    private categoriaService: CategoriaService,
    private marcaService: MarcaService,
    private productoAdminService: ProductoAdminService,
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCatalogos();
  }

  get productosStockBajo(): number {
    return this.productos.filter(
      (producto) => producto.stock > 0 && producto.stock <= 10,
    ).length;
  }

  get productosAgotados(): number {
    return this.productos.filter((producto) => producto.stock <= 0).length;
  }

  cargarProductos(): void {
    this.isLoading = true;

    this.productosService.obtenerTodosParaAdmin(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.productos = response.data.content;
          this.totalPages = response.data.totalPages;
        }

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.mostrarMensaje('danger', 'Error al cargar productos.');
      },
    });
  }

  abrirModalCrear(): void {
    this.isEditando = false;
    this.productoSeleccionado = null;
    this.mostrarModal = true;
  }

  abrirModalEditar(producto: Producto): void {
    this.isEditando = true;
    this.productoSeleccionado = producto;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    if (this.guardando) {
      return;
    }

    this.mostrarModal = false;
    this.productoSeleccionado = null;
  }

  ejecutarGuardado(evento: ProductoGuardarEvento): void {
    this.guardando = true;

    this.productoAdminService
      .guardar(this.productoSeleccionado, evento.request, evento.archivo)
      .subscribe({
        next: (response) => {
          this.guardando = false;

          if (!response.success) {
            return;
          }

          this.mostrarMensaje(
            'success',
            this.isEditando
              ? 'Producto actualizado exitosamente.'
              : 'Producto creado exitosamente.',
          );

          this.cerrarModal();
          this.cargarProductos();
        },
        error: (error) => {
          this.guardando = false;
          this.mostrarMensaje(
            'danger',
            error?.error?.message || error?.message || 'No se pudo guardar el producto.',
          );
        },
      });
  }

  cambiarEstado(producto: Producto): void {
    const accion = producto.estado === 'ACTIVO' ? 'desactivar' : 'activar';

    if (!confirm(`¿Deseas ${accion} el producto "${producto.nombre}"?`)) {
      return;
    }

    this.productoAdminService.cambiarEstado(producto).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarMensaje('success', 'Estado del producto actualizado.');
          this.cargarProductos();
        }
      },
      error: () => this.mostrarMensaje('danger', 'No se pudo cambiar el estado.'),
    });
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina < 1 || nuevaPagina > this.totalPages) {
      return;
    }

    this.currentPage = nuevaPagina;
    this.cargarProductos();
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(precio);
  }

  mostrarMensaje(tipo: 'success' | 'danger' | 'info', texto: string): void {
    this.mensaje = { tipo, texto };
    setTimeout(() => (this.mensaje = null), 3000);
  }

  private cargarCatalogos(): void {
    this.categoriaService.obtenerTodas().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categorias = response.data;
        }
      },
    });

    this.marcaService.obtenerTodas().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.marcas = response.data;
        }
      },
    });
  }
}
