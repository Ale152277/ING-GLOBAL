import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  AdminPedidoDetalle,
  EstadoPagoAdmin,
  EstadoPedidoAdmin,
} from '../../model/admin-order.model';

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
      case 'TRANSFERENCIA_DIRECTA':
        return 'Transferencia bancaria';
      default:
        return 'No registrado';
    }
  }

  obtenerNombreEstadoPedido(estado: EstadoPedidoAdmin): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'CONFIRMADA':
        return 'Confirmada';
      case 'COMPLETA':
        return 'Completada';
      case 'CANCELADA':
        return 'Cancelada';
    }
  }

  obtenerClaseEstadoPedido(estado: EstadoPedidoAdmin): string {
    return `pedido-${estado.toLowerCase()}`;
  }

  obtenerNombreEstadoPago(estado: EstadoPagoAdmin | null): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'EN_REVISION':
        return 'En revisión';
      case 'PAGADO':
        return 'Pagado';
      case 'RECHAZADO':
        return 'Rechazado';
      case 'EXPIRADO':
        return 'Expirado';
      case 'REEMBOLSADO':
        return 'Reembolsado';
      default:
        return 'No registrado';
    }
  }

  obtenerClaseEstadoPago(estado: EstadoPagoAdmin | null): string {
    if (!estado) {
      return 'pago-no-registrado';
    }

    return `pago-${estado.toLowerCase().replace('_', '-')}`;
  }

  get cantidadProductos(): number {
    return this.pedido.detalles.reduce(
      (total, detalle) => total + detalle.cantidad,
      0,
    );
  }
}
