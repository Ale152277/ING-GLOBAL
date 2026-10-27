
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FiltrosProductoAdmin } from '../../model/producto-filtro.model';
@Component({
  selector: 'app-producto-filtros',
  imports: [FormsModule],
  templateUrl: './producto-filtros.html',
})
export class ProductoFiltros {
  @Output() filtrar = new EventEmitter<FiltrosProductoAdmin>();

  filtros: FiltrosProductoAdmin = {};
  error = '';

  aplicar(): void {
    const { precioMin, precioMax, stockMin, stockMax } = this.filtros;

    if (
      [precioMin, precioMax, stockMin, stockMax].some(
        valor => valor != null && valor < 0
      )
    ) {
      this.error = 'Los valores no pueden ser negativos.';
      return;
    }

    if (
      (precioMin != null && precioMax != null && precioMin > precioMax) ||
      (stockMin != null && stockMax != null && stockMin > stockMax)
    ) {
      this.error = 'El valor mínimo no puede superar al máximo.';
      return;
    }

    this.error = '';
    this.filtrar.emit({ ...this.filtros });
  }

  limpiar(): void {
    this.filtros = {};
    this.error = '';
    this.filtrar.emit({});
  }
}
