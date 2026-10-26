import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminOrdersService } from '../services/admin-orders.service';
import { PedidoDetalleModel } from '../components/pedido-detalle-model/pedido-detalle-model';
import {
  AdminPedido,
  AdminPedidoDetalle,
  EstadoPagoAdmin,
  EstadoPedidoAdmin,
} from '../model/admin-order.model';

type FiltroEstadoPedido = EstadoPedidoAdmin | 'TODOS';
type FiltroEstadoPago = EstadoPagoAdmin | 'TODOS';

@Component({
  selector: 'app-admin-orders',
  imports: [PedidoDetalleModel, FormsModule],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrders implements OnInit {
  pedidos: AdminPedido[] = [];
  pedidoDetalle: AdminPedidoDetalle | null = null;

  cargando = false;
  cargandoDetalle = false;
  error = '';

  estadoPedidoFiltro: FiltroEstadoPedido = 'TODOS';
  estadoPagoFiltro: FiltroEstadoPago = 'TODOS';
  fechaDesde = '';
  fechaHasta = '';
  ocultarExpirados = true;

  toastMensaje = '';
  toastTipo: 'info' | 'success' | 'error' = 'info';
  private toastTimeout?: ReturnType<typeof setTimeout>;

  constructor(private adminOrdersService: AdminOrdersService) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  get pedidosFiltrados(): AdminPedido[] {
    return this.pedidos.filter((pedido) => {
      const coincideEstadoPedido =
        this.estadoPedidoFiltro === 'TODOS' || pedido.estado === this.estadoPedidoFiltro;

      const coincideEstadoPago =
        this.estadoPagoFiltro === 'TODOS' || pedido.estadoPago === this.estadoPagoFiltro;

      const fecha = pedido.fechaVenta.substring(0, 10);
      const coincideDesde = !this.fechaDesde || fecha >= this.fechaDesde;
      const coincideHasta = !this.fechaHasta || fecha <= this.fechaHasta;

      const visiblePorExpiracion =
        !this.ocultarExpirados || pedido.estadoPago !== 'EXPIRADO';

      return (
        coincideEstadoPedido &&
        coincideEstadoPago &&
        coincideDesde &&
        coincideHasta &&
        visiblePorExpiracion
      );
    });
  }

  verPedido(id: number): void {
    this.cargandoDetalle = true;

    this.adminOrdersService.obtenerPedidoPorId(id).subscribe({
      next: (response) => {
        this.cargandoDetalle = false;

        if (response.success && response.data) {
          this.pedidoDetalle = response.data;
        }
      },
      error: (error) => {
        this.cargandoDetalle = false;
        console.error('Error al obtener el pedido:', error);
        this.mostrarToast('No se pudo cargar el detalle del pedido.', 'error');
      },
    });
  }

  cerrarDetalle(): void {
    this.pedidoDetalle = null;
  }

  cargarPedidos(): void {
    this.cargando = true;
    this.error = '';

    this.adminOrdersService.obtenerPedidos(0, 100).subscribe({
      next: (response) => {
        this.cargando = false;

        if (!response.success) {
          this.error = 'No se pudieron cargar los pedidos';
          return;
        }

        this.pedidos = response.data.content;
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error al cargar pedidos:', error);
        this.error = 'Ocurrió un error al cargar los pedidos';
      },
    });
  }

  cambiarEstado(pedido: AdminPedido, nuevoEstado: EstadoPedidoAdmin): void {
    if (nuevoEstado === 'CONFIRMADA' && pedido.estadoPago !== 'PAGADO') {
      this.mostrarToast(
        'Primero debes gestionar y aprobar el pago antes de confirmar este pedido.',
        'error',
      );
      return;
    }

    if (nuevoEstado === 'CANCELADA' && !confirm(`¿Deseas cancelar el pedido #${pedido.id}?`)) {
      return;
    }

    this.adminOrdersService.actualizarEstado(pedido.id, nuevoEstado).subscribe({
      next: (response) => {
        if (!response.success) {
          return;
        }

        pedido.estado = response.data.estado;
        pedido.estadoPago = response.data.estadoPago;

        this.mostrarToast(
          `El pedido #${pedido.id} fue actualizado correctamente.`,
          'success',
        );
      },
      error: (error) => {
        console.error('Error al actualizar el estado:', error);

        const mensaje =
          error?.error?.message ||
          'No se pudo actualizar el estado del pedido.';

        this.mostrarToast(mensaje, 'error');
      },
    });
  }

  limpiarFiltros(): void {
    this.estadoPedidoFiltro = 'TODOS';
    this.estadoPagoFiltro = 'TODOS';
    this.fechaDesde = '';
    this.fechaHasta = '';
    this.ocultarExpirados = true;
  }

  formatearPrecio(total: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(total);
  }

  formatearFecha(fecha: string): string {
    if (!fecha) {
      return '-';
    }

    const [fechaParte] = fecha.split('T');
    const [anio, mes, dia] = fechaParte.split('-');

    return `${dia}/${mes}/${anio}`;
  }

  obtenerClaseEstado(estado: EstadoPedidoAdmin): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'estado-pendiente';
      case 'CONFIRMADA':
        return 'estado-confirmada';
      case 'COMPLETA':
        return 'estado-completada';
      case 'CANCELADA':
        return 'estado-cancelada';
      default:
        return '';
    }
  }

  obtenerClaseEstadoPago(estado: EstadoPagoAdmin | null): string {
    if (!estado) {
      return 'pago-no-registrado';
    }

    return `pago-${estado.toLowerCase().replace('_', '-')}`;
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

  cerrarToast(): void {
    this.toastMensaje = '';

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }

  private mostrarToast(
    mensaje: string,
    tipo: 'info' | 'success' | 'error' = 'info',
  ): void {
    this.toastMensaje = mensaje;
    this.toastTipo = tipo;

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    this.toastTimeout = setTimeout(() => {
      this.toastMensaje = '';
    }, 4500);
  }
}
