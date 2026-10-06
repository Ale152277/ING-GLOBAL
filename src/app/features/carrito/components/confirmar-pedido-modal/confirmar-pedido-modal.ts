import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../../models/usuario.model';
import { MetodoPago, CrearVentaRequest } from '../../../../models/venta.model';
@Component({
  selector: 'app-confirmar-pedido-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './confirmar-pedido-modal.html',
  styleUrl: './confirmar-pedido-modal.css',
})
export class ConfirmarPedidoModal implements OnInit {
  @Input() total = 0;
  @Input() procesando = false;
  @Input() usuario: Usuario | null = null;

  @Output() confirmar = new EventEmitter<CrearVentaRequest>();
  @Output() cancelar = new EventEmitter<void>();

  nombreReceptor = '';
  telefonoEntrega = '';
  direccionEntrega = '';
  referenciaEntrega = '';

  metodoPago: MetodoPago | null = null;

  ngOnInit(): void {
    if (!this.usuario) {
      return;
    }

    this.nombreReceptor = this.usuario.nombreCompleto || '';

    this.telefonoEntrega = this.usuario.telefono || '';

    this.direccionEntrega = this.usuario.direccion || '';
  }

  confirmarPedido(): void {
    if (
      !this.nombreReceptor.trim() ||
      !this.telefonoEntrega.trim() ||
      !this.direccionEntrega.trim() ||
      !this.metodoPago
    ) {
      return;
    }

    const request: CrearVentaRequest = {
      nombreReceptor: this.nombreReceptor.trim(),

      telefonoEntrega: this.telefonoEntrega.trim(),

      direccionEntrega: this.direccionEntrega.trim(),

      referenciaEntrega: this.referenciaEntrega.trim(),

      metodoPago: this.metodoPago,
    };

    this.confirmar.emit(request);
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
