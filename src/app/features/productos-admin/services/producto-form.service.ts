import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CrearProductoRequest } from '../../productos/models/crearProductoRequest';
import { Producto } from '../../productos/models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class ProductoFormService {
  constructor(private fb: FormBuilder) {}

  crear(producto?: Producto | null): FormGroup {
    const form = this.fb.group({
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

    this.cargarProducto(form, producto);
    return form;
  }

  cargarProducto(form: FormGroup, producto?: Producto | null): void {
    form.reset();

    if (producto) {
      form.patchValue(producto);
    }
  }

  construirRequest(values: any): CrearProductoRequest {
    return {
      nombre: values.nombre.trim(),
      sku: values.sku.trim(),
      precio: Number(values.precio),
      categoriaId: Number(values.categoriaId),
      marcaId: values.marcaId ? Number(values.marcaId) : undefined,
      descripcion: values.descripcion?.trim() || undefined,
      stock: Number(values.stock ?? 0),
      descuento: Number(values.descuento ?? 0),
      etiqueta: values.etiqueta || undefined,
      imagen: values.imagen?.trim() || undefined,
      rating: values.rating === '' || values.rating == null ? undefined : Number(values.rating),
    };
  }
}
