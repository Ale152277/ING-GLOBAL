import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  EstadoPagoVenta,
  EstadoVenta,
  MetodoPago,
  Venta,
} from '../../../../models/venta.model';
import { Pago } from '../../../pagos/models/pago.model';
import { PagoService } from '../../../pagos/service/pago.service';

@Component({
  selector: 'app-pedido-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './pedido-card.html',
  styleUrl: './pedido-card.css',
})
export class PedidoCard {
  @Input() pedido!: Venta;

  expandido = false;
  cargandoPago = false;
  pagoCargado = false;
  pago: Pago | null = null;
  errorPago = '';

  constructor(private pagoService: PagoService) {}

  get cantidadProductos(): number {
    return this.pedido.detalles.reduce(
      (total, detalle) => total + detalle.cantidad,
      0,
    );
  }

  toggleDetalle(): void {
    this.expandido = !this.expandido;

    if (this.expandido && !this.pagoCargado) {
      this.cargarPago();
    }
  }

  verComprobante(): void {
    if (!this.pago?.comprobanteEnviado) {
      return;
    }

    this.errorPago = '';

    this.pagoService.obtenerComprobante(this.pago.id).subscribe({
      next: (archivo) => {
        const url = URL.createObjectURL(archivo);
        window.open(url, '_blank', 'noopener,noreferrer');
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      },
      error: () => {
        this.errorPago = 'No se pudo abrir el comprobante.';
      },
    });
  }

  formatearPrecio(valor: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(valor);
  }

  formatearFecha(fecha: string | null | undefined): string {
    if (!fecha) {
      return 'No registrado';
    }

    return new Intl.DateTimeFormat('es-PE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(fecha));
  }

  nombreMetodo(metodo: MetodoPago | null): string {
    switch (metodo) {
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

  nombreEstadoPedido(estado: EstadoVenta): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'CONFIRMADA':
        return 'Confirmado';
      case 'COMPLETA':
        return 'Completado';
      case 'CANCELADA':
        return 'Cancelado';
    }
  }

  nombreEstadoPago(estado: EstadoPagoVenta | null): string {
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

  claseEstadoPedido(estado: EstadoVenta): string {
    return `estado-${estado.toLowerCase()}`;
  }

  claseEstadoPago(estado: EstadoPagoVenta | null): string {
    return estado
      ? `pago-${estado.toLowerCase().replace('_', '-')}`
      : 'pago-no-registrado';
  }

  private cargarPago(): void {
    this.cargandoPago = true;
    this.errorPago = '';

    this.pagoService.obtenerPagosDeVenta(this.pedido.id).subscribe({
      next: (response) => {
        this.pago = response.data?.[0] ?? null;
        this.pagoCargado = true;
        this.cargandoPago = false;
      },
      error: () => {
        this.errorPago = 'No se pudo cargar la información del pago.';
        this.pagoCargado = true;
        this.cargandoPago = false;
      },
    });
  }
}
