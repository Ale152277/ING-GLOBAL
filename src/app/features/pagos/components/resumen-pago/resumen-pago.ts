import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Pago } from '../../models/pago.model';

@Component({
  selector: 'app-resumen-pago',
  imports: [CommonModule],
  templateUrl: './resumen-pago.html',
  styleUrl: './resumen-pago.css',
})
export class ResumenPago {
  @Input({ required: true })
  pago!: Pago;

  obtenerNombreMetodoPago(): string {
    switch (this.pago.metodoPago) {
      case 'YAPE':
        return 'Yape';

      case 'PLIN':
        return 'Plin';

      case 'TRANSFERENCIA_DIRECTA':
        return 'Transferencia';

      default:
        return this.pago.metodoPago;
    }
  }

  obtenerClaseEstado(): string {
    switch (this.pago.estadoPago) {
      case 'PENDIENTE':
        return 'status-pending';

      case 'EN_REVISION':
        return 'status-review';

      case 'PAGADO':
        return 'status-paid';

      case 'RECHAZADO':
        return 'status-rejected';

      case 'EXPIRADO':
        return 'status-expired';

      case 'REEMBOLSADO':
        return 'status-refunded';

      default:
        return '';
    }
  }

  obtenerNombreEstado(): string {
    switch (this.pago.estadoPago) {
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
        return this.pago.estadoPago;
    }
  }
}
