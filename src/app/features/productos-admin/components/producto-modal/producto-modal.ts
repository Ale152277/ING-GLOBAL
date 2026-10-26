import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Categoria } from '../../../../models/categoria.model';
import { Marca } from '../../../../models/marca.model';
import { CrearProductoRequest } from '../../../productos/models/crearProductoRequest';
import { Producto } from '../../../productos/models/producto.model';
import { ProductoFormService } from '../../services/producto-form.service';
import {
  ProductoImagenCambio,
  ProductoImagenInput,
} from '../producto-imagen-input/producto-imagen-input';

export interface ProductoGuardarEvento {
  request: CrearProductoRequest;
  archivo: File | null;
}

@Component({
  selector: 'app-producto-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProductoImagenInput],
  templateUrl: './producto-modal.html',
  styleUrl: './producto-modal.css',
})
export class ProductoModal implements OnChanges {
  @Input() categorias: Categoria[] = [];
  @Input() marcas: Marca[] = [];
  @Input() isEditando = false;
  @Input() productoSeleccionado: Producto | null = null;
  @Input() bloqueado = false;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<ProductoGuardarEvento>();
  @Output() errorValidacion = new EventEmitter<string>();

  productoForm: FormGroup;
  archivoSeleccionado: File | null = null;
  imagenActual = '';

  readonly etiquetasDisponibles = ['bestseller', 'new', 'premium', 'promo', 'agotado'];

  constructor(private formService: ProductoFormService) {
    this.productoForm = this.formService.crear();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['productoSeleccionado']) {
      return;
    }

    this.formService.cargarProducto(this.productoForm, this.productoSeleccionado);
    this.imagenActual = this.productoSeleccionado?.imagen ?? '';
    this.archivoSeleccionado = null;
  }

  esValido(campo: string): boolean {
    const control = this.productoForm.get(campo);
    return !!(control?.invalid && control.touched);
  }

  actualizarImagen(cambio: ProductoImagenCambio): void {
    this.archivoSeleccionado = cambio.archivo;
    this.productoForm.patchValue({ imagen: cambio.url });
  }

  onGuardar(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      this.errorValidacion.emit('Completa correctamente los campos obligatorios.');
      return;
    }

    this.guardar.emit({
      request: this.formService.construirRequest(this.productoForm.value),
      archivo: this.archivoSeleccionado,
    });
  }
}
