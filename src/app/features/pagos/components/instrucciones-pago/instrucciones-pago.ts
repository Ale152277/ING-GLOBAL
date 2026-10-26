import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Pago } from '../../models/pago.model';

@Component({
  selector: 'app-instrucciones-pago',
  imports: [CommonModule],
  templateUrl: './instrucciones-pago.html',
  styleUrl: './instrucciones-pago.css',
})
export class InstruccionesPago {
  @Input({ required: true })
  pago!: Pago;

  @Input()
  tiempoRestante = '';

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

  obtenerLogoMetodo(): string {
    switch (this.pago.metodoPago) {
      case 'YAPE':
        return 'assets/Yape/yape.png';

      case 'PLIN':
        return 'assets/Plin/plin.png';

      default:
        return '';
    }
  }

  obtenerQrMetodo(): string {
    switch (this.pago.metodoPago) {
      case 'YAPE':
        return 'assets/Yape/QR.jpeg';

      case 'PLIN':
        return 'assets/Plin/QR-plin.jpeg';

      default:
        return '';
    }
  }

  obtenerInstrucciones(): string[] {
    switch (this.pago.metodoPago) {
      case 'YAPE':
        return [
          'Abre la aplicación de Yape.',
          'Escanea el código QR.',
          'Ingresa el monto exacto indicado en el resumen del pedido.',
          'Confirma el pago.',
        ];

      case 'PLIN':
        return [
          'Abre la aplicación desde la que utilizas Plin.',
          'Escanea el código QR.',
          'Ingresa el monto exacto indicado en el resumen del pedido.',
          'Confirma el pago.',
        ];

      case 'TRANSFERENCIA_DIRECTA':
        return [
          'Ingresa a tu aplicación o banca por internet.',
          'Realiza la transferencia utilizando los datos indicados.',
          'Verifica que el monto sea exactamente el del pedido.',
          'Guarda el comprobante de la operación.',
        ];

      default:
        return [];
    }
  }

  readonly datosTransferencia = {
    banco: '',
    titular: '',
    cuenta: '',
    cci: '',
  };
}
