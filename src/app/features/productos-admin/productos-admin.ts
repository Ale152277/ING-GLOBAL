import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProductosService } from '../productos/services/productos.service';
import { AuthService } from '../../core/services/auth.service';
import { Producto } from '../../models/producto.model';
import { CrearProductoRequest, EditarProductoRequest } from '../../models/crearProductoRequest';
import { Categoria } from '../../models/categoria.model';
import { Marca } from '../../models/marca.model';
import { CategoriaService } from '../../core/services/categoria.service';
import { MarcaService } from '../../core/services/marca.service';
import { error } from 'console';

@Component({
  selector: 'app-productos-admin',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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

  productoForm: FormGroup;

  mensaje: { tipo: 'success' | 'danger' | 'info'; texto: string } | null = null;

  constructor(
    private productoService: ProductosService,
    private authService: AuthService,
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private marcaService: MarcaService,
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      sku: ['', [Validators.required, Validators.minLength(3)]],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      categoriaId: ['', Validators.required],
      marcaId: [''],
      descripcion: [''],
      stock: ['', [Validators.required, Validators.min(0)]],
      descuento: ['', [Validators.min(0), Validators.max(100)]],
      etiqueta: [''],
      imagen: [''],
      rating: ['', [Validators.min(0), Validators.max(5)]],
    });
  }

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
          console.log('Productos cargados:', this.productos.length);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.mostrarMensaje('danger', 'Error al cargar productos.');
        this.isLoading = false;
      },
    });
  }

  cargarMarcas(): void {
    this.marcaService.obtenerTodas().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.marca = response.data;
        }
      },
      error: (error) => {
        console.log('Error:', error);
      },
    });
  }

  cargarCategorias():void{
    this.categoriaService.obtenerTodas().subscribe({
      next:(response)=>{
        if(response.success && response.data){
          this.categoria = response.data;
        }
      },
      error:(error)=>{
        console.log('Error', error)
      }
    })
  }



  abrirModalCrear(): void {
    this.isEditando = false;
    this.productoSeleccionado = null;
    this.productoForm.reset();
    this.mostrarModal = true;
  }

  abrirModalEditar(producto: Producto): void {
    this.isEditando = true;
    this.productoSeleccionado = producto;

    this.productoForm.patchValue({
      nombre: producto.nombre,
      sku: producto.sku,
      precio: producto.precio,
      categoriaId: producto.categoriaId,
      marcaId: producto.marcaId,
      descripcion: producto.descripcion,
      stock: producto.stock,
      descuento: producto.descuento,
      etiqueta: producto.etiqueta,
      imagen: producto.imagen,
      rating: producto.rating,
    });

    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.productoForm.reset();
    this.productoSeleccionado = null;
  }

  guardarProducto(): void {
    if (!this.productoForm.valid) {
      this.mostrarMensaje('danger', 'Por favor completa todos los campos requeridos');
      return;
    }

    const datosFormulario = this.productoForm.value;

    const datosBase: CrearProductoRequest = {
      nombre: datosFormulario.nombre,
      sku: datosFormulario.sku,
      precio: parseFloat(datosFormulario.precio), // BigDecimal en backend
      categoriaId: parseInt(datosFormulario.categoriaId), // Long en backend
      categoriaNombre: datosFormulario.categoriaNombre,
      marcaId: datosFormulario.marcaId ? parseInt(datosFormulario.marcaId) : undefined,
      marcaNombre: datosFormulario.marcaNombre,
      descripcion: datosFormulario.descripcion || undefined,
      stock: datosFormulario.stock ? parseInt(datosFormulario.stock) : 0, // Integer en backend
      descuento: datosFormulario.descuento ? parseInt(datosFormulario.descuento) : 0, // Integer en backend
      etiqueta: datosFormulario.etiqueta || undefined,
      imagen: datosFormulario.imagen || undefined,
      rating: datosFormulario.rating ? parseFloat(datosFormulario.rating) : undefined, // BigDecimal en backend
    };

    if (this.isEditando && this.productoSeleccionado) {
      const datosEditar: EditarProductoRequest = { ...datosBase, id: this.productoSeleccionado.id };
      // EDITAR
      this.productoService.editarProducto(this.productoSeleccionado.id, datosEditar).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarMensaje('success', ' Producto actualizado exitosamente');
            this.cerrarModal();
            this.cargarProductos();
          }
        },
        error: (error) => {
          console.error('❌ Error al editar producto:', error);
          this.mostrarMensaje('danger', error.error?.message || 'Error al actualizar el producto');
        },
      });
    } else {
      // CREAR
      const datosCrear: CrearProductoRequest = datosBase;
      this.productoService.crearProducto(datosCrear).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarMensaje('success', ' Producto creado exitosamente');
            this.cerrarModal();
            this.cargarProductos();
          }
        },
        error: (error) => {
          console.error(' Error al crear producto:', error);
          this.mostrarMensaje('danger', error.error?.message || 'Error al crear el producto');
        },
      });
    }
  }

  cambiarEstado(producto: Producto): void {
    const nuevoEstado = producto.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    const accion = producto.estado === 'ACTIVO' ? 'Desactivar' : 'Activar';

    if (!confirm(`¿${accion} el producto "${producto.nombre}"?`)) {
      return;
    }

    this.productoService.cambiarEstado(producto.id, nuevoEstado).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarMensaje('success', `Producto ${nuevoEstado.toLowerCase()}`);
          this.cargarProductos();
        }
      },
      error: (error) => {
        console.error('Error:', error);
        this.mostrarMensaje('danger', 'Error al cambiar estado');
      },
    });
  }

  eliminarProducto(producto: Producto): void {
    if (!confirm(`¿Estás seguro de que deseas eliminar el producto "${producto.nombre}"?`)) {
      return;
    }

    this.productoService.eliminarProducto(producto.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarMensaje('success', ' Producto eliminado exitosamente');
          this.cargarProductos();
        }
      },
      error: (error) => {
        console.error(' Error al eliminar producto:', error);
        this.mostrarMensaje('danger', error.error?.message || 'Error al eliminar el producto');
      },
    });
  }

  // ==================== UTILIDADES ====================

  mostrarMensaje(tipo: 'success' | 'danger' | 'info', texto: string): void {
    this.mensaje = { tipo, texto };

    // Auto cerrar el mensaje después de 3 segundos
    setTimeout(() => {
      this.mensaje = null;
    }, 3000);
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina > 0 && nuevaPagina <= this.totalPages) {
      this.currentPage = nuevaPagina;
      this.cargarProductos();
    }
  }

  obtenerEstado(producto: Producto): string {
    return producto.estado === 'ACTIVO' ? 'Activo' : 'Inactivo';
  }

  esValido(campo: string): boolean {
    const control = this.productoForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }
}
