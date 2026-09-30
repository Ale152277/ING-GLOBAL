import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmar-pedido-modal',
  imports: [CommonModule],
  templateUrl: './confirmar-pedido-modal.html',
  styleUrl: './confirmar-pedido-modal.css',
})
export class ConfirmarPedidoModal {

  @Input() total = 0;
  @Input() procesando = false;

  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  confirmarPedido(): void {
    this.confirmar.emit();
  }

  cancelarPedido(): void {
    this.cancelar.emit();
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(precio);
  }
}