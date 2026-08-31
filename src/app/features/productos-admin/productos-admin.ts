import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../productos/services/productos.service';
import { AuthService } from '../../core/services/auth.service';
import { Producto } from '../../models/producto.model';
import { CrearProductoRequest, EditarProductoRequest } from '../../models/crearProductoRequest';
import { Categoria } from '../../models/categoria.model';
import { Marca } from '../../models/marca.model';
import { CategoriaService } from '../../core/services/categoria.service';
import { MarcaService } from '../../core/services/marca.service';
import { ProductoModal } from './producto-modal';

@Component({
  selector: 'app-productos-admin',
  imports: [CommonModule, ProductoModal],
  templateUrl: './productos-admin.html',
  styleUrl: './productos-admin.css',
})
export class ProductosAdmin implements OnInit {
  productos: Producto[] = [];
  categoria: Categoria[] = [];
  marca: Marca[] = [];
  isLoading = false;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  mostrarModal = false;
  isEditando = false;
  productoSeleccionado: Producto | null = null;
  subiendoImagen = false;
  mensaje: { tipo: 'success' | 'danger' | 'info'; texto: string } | null = null;

  constructor(
    private productoService: ProductosService,
    private authService: AuthService,
    private categoriaService: CategoriaService,
    private marcaService: MarcaService,
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarMarcas();
  }

  cargarProductos(): void {
    this.isLoading = true;
    this.productoService.obtenerTodosParaAdmin(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.productos = response.data.content;
          this.totalPages = response.data.totalPages;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.mostrarMensaje('danger', 'Error al cargar productos.');
        this.isLoading = false;
      },
    });
  }

  cargarMarcas(): void {
    this.marcaService.obtenerTodas().subscribe({
      next: (response) => {
        if (response.success && response.data) this.marca = response.data;
      }
    });
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerTodas().subscribe({
      next: (response) => {
        if (response.success && response.data) this.categoria = response.data;
      }
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
    this.mostrarModal = false;
    this.productoSeleccionado = null;
  }

  ejecutarGuardado(evento: { values: any; modoImagen: string; archivoSeleccionado: File | null }): void {
    if (evento.modoImagen === 'archivo' && evento.archivoSeleccionado) {
      this.subiendoImagen = true;
      this.productoService.subirImagen(evento.archivoSeleccionado).subscribe({
        next: (response) => {
          this.subiendoImagen = false;
          if (response.success && response.data) {
            evento.values.imagen = response.data;
            this.enviarDatosBackend(evento.values);
          }
        },
        error: (error) => {
          this.subiendoImagen = false;
          this.mostrarMensaje('danger', error.error?.message || 'Error al subir la imagen');
        }
      });
    } else {
      this.enviarDatosBackend(evento.values);
    }
  }

  private enviarDatosBackend(datosFormulario: any): void {
    const datosBase: CrearProductoRequest = {
      nombre: datosFormulario.nombre,
      sku: datosFormulario.sku,
      precio: parseFloat(datosFormulario.precio),
      categoriaId: parseInt(datosFormulario.categoriaId),
      categoriaNombre: datosFormulario.categoriaNombre,
      marcaId: datosFormulario.marcaId ? parseInt(datosFormulario.marcaId) : undefined,
      marcaNombre: datosFormulario.marcaNombre,
      descripcion: datosFormulario.descripcion || undefined,
      stock: datosFormulario.stock ? parseInt(datosFormulario.stock) : 0,
      descuento: datosFormulario.descuento ? parseInt(datosFormulario.descuento) : 0,
      etiqueta: datosFormulario.etiqueta || undefined,
      imagen: datosFormulario.imagen || undefined,
      rating: datosFormulario.rating ? parseFloat(datosFormulario.rating) : undefined,
    };

    if (this.isEditando && this.productoSeleccionado) {
      const datosEditar: EditarProductoRequest = { ...datosBase, id: this.productoSeleccionado.id };
      this.productoService.editarProducto(this.productoSeleccionado.id, datosEditar).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarMensaje('success', 'Producto actualizado exitosamente');
            this.cerrarModal();
            this.cargarProductos();
          }
        },
        error: (error) => this.mostrarMensaje('danger', error.error?.message || 'Error al actualizar el producto'),
      });
    } else {
      this.productoService.crearProducto(datosBase).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarMensaje('success', 'Producto creado exitosamente');
            this.cerrarModal();
            this.cargarProductos();
          }
        },
        error: (error) => this.mostrarMensaje('danger', error.error?.message || 'Error al crear el producto'),
      });
    }
  }

  cambiarEstado(producto: Producto): void {
    const nuevoEstado = producto.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    const accion = producto.estado === 'ACTIVO' ? 'Desactivar' : 'Activar';

    if (!confirm(`¿${accion} el producto "${producto.nombre}"?`)) return;

    this.productoService.cambiarEstado(producto.id, nuevoEstado).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarMensaje('success', `Producto ${nuevoEstado.toLowerCase()}`);
          this.cargarProductos();
        }
      },
      error: () => this.mostrarMensaje('danger', 'Error al cambiar estado'),
    });
  }

  eliminarProducto(producto: Producto): void {
    if (!confirm(`¿Estás seguro de que deseas eliminar el producto "${producto.nombre}"?`)) return;

    this.productoService.eliminarProducto(producto.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarMensaje('success', 'Producto eliminado exitosamente');
          this.cargarProductos();
        }
      },
      error: (error) => this.mostrarMensaje('danger', error.error?.message || 'Error al eliminar el producto'),
    });
  }

  mostrarMensaje(tipo: 'success' | 'danger' | 'info', texto: string): void {
    this.mensaje = { tipo, texto };
    setTimeout(() => (this.mensaje = null), 3000);
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina > 0 && nuevaPagina <= this.totalPages) {
      this.currentPage = nuevaPagina;
      this.cargarProductos();
    }
  }
}