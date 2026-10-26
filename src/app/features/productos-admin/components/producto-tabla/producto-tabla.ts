import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Producto } from '../../../productos/models/producto.model';

@Component({
  selector: 'app-producto-tabla',
  imports: [CommonModule],
  templateUrl: './producto-tabla.html',
  styleUrl: './producto-tabla.css',
})
export class ProductoTabla {
  @Input() productos: Producto[] = [];
  @Input() cargando = false;
  @Input() paginaActual = 1;
  @Input() tamanoPagina = 10;
  @Input() totalPaginas = 0;

  @Output() editar = new EventEmitter<Producto>();
  @Output() cambiarEstado = new EventEmitter<Producto>();
  @Output() cambiarPagina = new EventEmitter<number>();

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(precio);
  }
}
