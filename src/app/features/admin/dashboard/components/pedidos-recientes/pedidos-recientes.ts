import { Component, Input } from '@angular/core';
import { EstadoPedidoDashboard, PedidoReciente } from '../../model/dashboard.model';
@Component({
  selector: 'app-pedidos-recientes',
  imports: [],
  templateUrl: './pedidos-recientes.html',
  styleUrl: './pedidos-recientes.css',
})
export class PedidosRecientes {
  @Input() pedidos: PedidoReciente[] = [];

  obtenerClaseEstado(estado: EstadoPedidoDashboard): string {
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

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(precio);
  }

  formatearFecha(fecha: string): string{

    if(!fecha){
      return '-'
    }
    const [fechaParte] = fecha.split('T');

  const [anio, mes, dia] = fechaParte.split('-');

    return `${dia}/${mes}/${anio}`;

  }
}
