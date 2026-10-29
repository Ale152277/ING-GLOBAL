import { Component, EventEmitter, Input, OnInit, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../../models/usuario.model';
import { MetodoPago, CrearVentaRequest } from '../../../../models/venta.model';
import { Direccion } from '../../../../models/direccion.model';
import { DireccionService } from '../../../cuenta/services/direccion.service';

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

  direcciones: Direccion[] = [];
  direccionSeleccionadaId: number | null = null;

  cargandoDirecciones = false;
  avisoDirecciones = '';
  errorFormulario = '';

  nombreReceptor = '';
  telefonoEntrega = '';
  direccionEntrega = '';
  referenciaEntrega = '';
  metodoPago: MetodoPago | null = null;

  constructor (private direccionService: DireccionService){}

  ngOnInit(): void {
    this.usarDireccionManual();
    this.cargarDirecciones();
  }

  cargarDirecciones(): void {
    this.cargandoDirecciones = true;

    this.direccionService.listar().subscribe({
      next: (response) => {
        this.cargandoDirecciones = false;

        if (!response.success) {
          this.avisoDirecciones = 'No se pudieron cargar tus direcciones guardadas.';
          return;
        }

        this.direcciones = response.data ?? [];

        const predeterminada = this.direcciones.find(d => d.predeterminada);

        if (predeterminada) {
          this.seleccionarDireccion(predeterminada.id);
        }
      },
      error: () => {
        this.cargandoDirecciones = false;
        this.avisoDirecciones = 'No se pudieron cargar tus direcciones guardadas.';
      },
    });
  }

  seleccionarDireccion(id: number | null): void {
    this.direccionSeleccionadaId = id;
    this.errorFormulario = '';

    if (id === null) {
      this.usarDireccionManual();
      return;
    }

    const direccion = this.direcciones.find(d => d.id === id);

    if (!direccion) {
      this.usarDireccionManual();
      return;
    }

    this.nombreReceptor = direccion.nombreReceptor;
    this.telefonoEntrega = direccion.telefono;
    this.referenciaEntrega = direccion.referencia ?? '';

    this.direccionEntrega = [
      direccion.direccion,
      direccion.distrito,
      direccion.provincia,
      direccion.departamento,
      direccion.codigoPostal ? `CP ${direccion.codigoPostal}` : '',
    ].filter(Boolean).join(', ');
  }

  usarDireccionManual(): void {
    this.direccionSeleccionadaId = null;
    this.nombreReceptor = this.usuario?.nombreCompleto ?? '';
    this.telefonoEntrega = this.usuario?.telefono ?? '';
    this.direccionEntrega = this.usuario?.direccion ?? '';
    this.referenciaEntrega = '';
  }


  confirmarPedido(): void {
    if (this.procesando || !this.metodoPago) return;

    if (
      !this.nombreReceptor.trim() ||
      !this.telefonoEntrega.trim() ||
      !this.direccionEntrega.trim()
    ) {
      this.errorFormulario = 'Completa los datos de entrega.';
      return;
    }

    if (this.direccionEntrega.length > 255) {
      this.errorFormulario = 'La dirección supera los 255 caracteres permitidos.';
      return;
    }

    this.errorFormulario = '';

    this.confirmar.emit({
      nombreReceptor: this.nombreReceptor.trim(),
      telefonoEntrega: this.telefonoEntrega.trim(),
      direccionEntrega: this.direccionEntrega.trim(),
      referenciaEntrega: this.referenciaEntrega.trim(),
      metodoPago: this.metodoPago,
    });
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
