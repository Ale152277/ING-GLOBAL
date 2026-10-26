import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pago } from '../../models/pago.model';

@Component({
  selector: 'app-estado-pago',
  imports: [CommonModule],
  templateUrl: './estado-pago.html',
  styleUrl: './estado-pago.css',
})
export class EstadoPago {
  @Input({ required: true })
  pago!: Pago;

  @Input()
  plazoVencido = false;

  obtenerClaseEstado(): string {
    if (this.pago.estadoPago === 'PENDIENTE' && this.plazoVencido) {
      return 'state-expired';
    }

    switch (this.pago.estadoPago) {
      case 'EN_REVISION':
        return 'state-review';

      case 'PAGADO':
        return 'state-paid';

      case 'RECHAZADO':
        return 'state-rejected';

      case 'EXPIRADO':
        return 'state-expired';

      case 'REEMBOLSADO':
        return 'state-refunded';

      default:
        return '';
    }
  }
}
