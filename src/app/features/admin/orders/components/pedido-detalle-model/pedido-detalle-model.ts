import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AdminPedidoDetalle } from '../../model/admin-order.model';

@Component({
  selector: 'app-pedido-detalle-model',
  imports: [],
  templateUrl: './pedido-detalle-model.html',
  styleUrl: './pedido-detalle-model.css',
})
export class PedidoDetalleModel {
  @Input()
  pedido!: AdminPedidoDetalle;

  @Output()
  cerrar = new EventEmitter<void>();

  cerrarModal(): void {
    this.cerrar.emit();
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(precio);
  }
  formatearFecha(fecha: string): string {
    if (!fecha) {
      return '-';
    }

    const [fechaParte] = fecha.split('T');
    const [anio, mes, dia] = fechaParte.split('-');

    return `${dia}/${mes}/${anio}`;
  }

  formatearMetodoPago(): string {
    switch (this.pedido.metodoPago) {
      case 'YAPE':
        return 'Yape';

      case 'PLIN':
        return 'Plin';

      case 'TRANSFERENCIA':
        return 'Transferencia bancaria';

      case 'CONTRA_ENTREGA':
        return 'Contra entrega';

      default:
        return 'No registrado';
    }
  }
}
