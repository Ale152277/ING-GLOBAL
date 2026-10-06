import { Component, OnInit } from '@angular/core';
import { AdminPedido, EstadoPedidoAdmin } from '../model/admin-order.model';
import { AdminOrdersService } from '../services/admin-orders.service';
@Component({
  selector: 'app-admin-orders',
  imports: [],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrders implements OnInit {
  pedidos: AdminPedido[] = [];

  cargando = false;
  error = '';

  constructor(private adminOrdersService: AdminOrdersService) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.cargando = true;
    this.error = '';

    this.adminOrdersService.obtenerPedidos().subscribe({
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
    if (nuevoEstado === 'CANCELADA' && !confirm(`¿Deseas cancelar el pedido #${pedido.id}?`)) {
      return;
    }

    this.adminOrdersService.actualizarEstado(pedido.id, nuevoEstado).subscribe({
      next: (response) => {
        if (!response.success) {
          return;
        }

        pedido.estado = response.data.estado;
      },

      error: (error) => {
        console.error('Error al actualizar el estado:', error);
      },
    });
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
}
