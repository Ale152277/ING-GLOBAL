import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminPago, EstadoPago } from '../../../../pagos/models/pago.model';
import { MetodoPago } from '../../../../../models/venta.model';
import { AdminPagoService } from '../../services/admin-pago.service';

type FiltroEstado = EstadoPago | 'TODOS';
type FiltroMetodo = MetodoPago | 'TODOS';

@Component({
  selector: 'app-revision-pagos',
  imports: [CommonModule, FormsModule],
  templateUrl: './revision-pagos.html',
  styleUrl: './revision-pagos.css',
})
export class RevisionPagos implements OnInit {
  pagos: AdminPago[] = [];

  cargando = false;
  procesandoPagoId: number | null = null;
  error = '';
  mensaje = '';

  estadoFiltro: FiltroEstado = 'EN_REVISION';
  metodoFiltro: FiltroMetodo = 'TODOS';
  fechaDesde = '';
  fechaHasta = '';

  pagoARechazar: AdminPago | null = null;
  motivoRechazo = '';
  errorRechazo = '';

  constructor(private adminPagoService: AdminPagoService) {}

  ngOnInit(): void {
    this.cargarPagos();
  }

  get pagosFiltrados(): AdminPago[] {
    return this.pagos.filter((pago) => {
      const coincideEstado =
        this.estadoFiltro === 'TODOS' || pago.estadoPago === this.estadoFiltro;

      const coincideMetodo =
        this.metodoFiltro === 'TODOS' || pago.metodoPago === this.metodoFiltro;

      const fechaPago = (pago.fechaComprobante || pago.fechaCreacion).substring(0, 10);
      const coincideDesde = !this.fechaDesde || fechaPago >= this.fechaDesde;
      const coincideHasta = !this.fechaHasta || fechaPago <= this.fechaHasta;

      return coincideEstado && coincideMetodo && coincideDesde && coincideHasta;
    });
  }

  cargarPagos(): void {
    this.cargando = true;
    this.error = '';

    this.adminPagoService.obtenerPagos().subscribe({
      next: (response) => {
        this.pagos = response.data;
        this.cargando = false;
      },
      error: (error) => {
        console.error(error);
        this.error = 'No se pudo cargar el historial de pagos.';
        this.cargando = false;
      },
    });
  }

  aprobarPago(pago: AdminPago): void {
    this.prepararOperacion(pago.id);

    this.adminPagoService.aprobarPago(pago.id).subscribe({
      next: (response) => {
        this.actualizarPago(response.data);
        this.mensaje = `El pago del pedido #${pago.ventaId} fue aprobado correctamente.`;
        this.procesandoPagoId = null;
      },
      error: (error) => {
        console.error(error);
        this.error = this.obtenerMensajeError(error, 'No se pudo aprobar el pago.');
        this.procesandoPagoId = null;
      },
    });
  }

  abrirRechazo(pago: AdminPago): void {
    this.pagoARechazar = pago;
    this.motivoRechazo = '';
    this.errorRechazo = '';
  }

  cerrarRechazo(): void {
    if (this.procesandoPagoId !== null) {
      return;
    }

    this.pagoARechazar = null;
    this.motivoRechazo = '';
    this.errorRechazo = '';
  }

  confirmarRechazo(): void {
    if (!this.pagoARechazar) {
      return;
    }

    const motivo = this.motivoRechazo.trim();

    if (!motivo) {
      this.errorRechazo = 'Debes indicar el motivo del rechazo.';
      return;
    }

    if (motivo.length > 500) {
      this.errorRechazo = 'El motivo no puede superar los 500 caracteres.';
      return;
    }

    const pago = this.pagoARechazar;
    this.prepararOperacion(pago.id);
    this.errorRechazo = '';

    this.adminPagoService.rechazarPago(pago.id, motivo).subscribe({
      next: (response) => {
        this.actualizarPago(response.data);
        this.mensaje = `El pago del pedido #${pago.ventaId} fue rechazado.`;
        this.procesandoPagoId = null;
        this.pagoARechazar = null;
        this.motivoRechazo = '';
      },
      error: (error) => {
        console.error(error);
        this.errorRechazo = this.obtenerMensajeError(error, 'No se pudo rechazar el pago.');
        this.procesandoPagoId = null;
      },
    });
  }

  verComprobante(pago: AdminPago): void {
    this.error = '';

    this.adminPagoService.obtenerComprobante(pago.id).subscribe({
      next: (archivo) => {
        const url = URL.createObjectURL(archivo);
        window.open(url, '_blank', 'noopener,noreferrer');
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      },
      error: (error) => {
        console.error(error);
        this.error = 'No se pudo cargar el comprobante.';
      },
    });
  }

  limpiarFiltros(): void {
    this.estadoFiltro = 'EN_REVISION';
    this.metodoFiltro = 'TODOS';
    this.fechaDesde = '';
    this.fechaHasta = '';
  }

  obtenerNombreMetodo(pago: AdminPago): string {
    switch (pago.metodoPago) {
      case 'YAPE':
        return 'Yape';
      case 'PLIN':
        return 'Plin';
      case 'TRANSFERENCIA_DIRECTA':
        return 'Transferencia';
      default:
        return pago.metodoPago;
    }
  }

  obtenerNombreEstado(estado: EstadoPago): string {
    switch (estado) {
      case 'EN_REVISION':
        return 'En revisión';
      case 'PAGADO':
        return 'Aprobado';
      case 'RECHAZADO':
        return 'Rechazado';
      case 'PENDIENTE':
        return 'Pendiente';
      case 'EXPIRADO':
        return 'Expirado';
      case 'REEMBOLSADO':
        return 'Reembolsado';
    }
  }

  obtenerClaseEstado(estado: EstadoPago): string {
    return `estado-${estado.toLowerCase().replace('_', '-')}`;
  }

  private prepararOperacion(pagoId: number): void {
    this.procesandoPagoId = pagoId;
    this.error = '';
    this.mensaje = '';
  }

  private actualizarPago(pagoActualizado: AdminPago): void {
    this.pagos = this.pagos.map((pago) =>
      pago.id === pagoActualizado.id ? pagoActualizado : pago,
    );
  }

  private obtenerMensajeError(error: any, respaldo: string): string {
    return error?.error?.message || respaldo;
  }
}
