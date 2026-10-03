import { Component, Input } from '@angular/core';
import { PedidoMes } from '../../model/dashboard.model';
@Component({
  selector: 'app-pedidos-por-mes',
  imports: [],
  templateUrl: './pedidos-por-mes.html',
  styleUrl: './pedidos-por-mes.css',
})
export class PedidosPorMes {
  @Input() datos: PedidoMes[] = [];

  obtenerAltura(total: number): number {
    if (this.datos.length === 0) {
      return 0;
    }
    const valores = this.datos.map((item) => item.total);
    const maximo = Math.max(...valores);

    if (maximo === 0) {
      return 0;
    }

    return (total / maximo) * 100;
  }
}
