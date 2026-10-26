import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminPago } from '../../../../pagos/models/pago.model';
import { AdminPagoService } from '../../services/admin-pago.service';
import { response } from 'express';
@Component({
  selector: 'app-revision-pagos',
  imports: [CommonModule],
  templateUrl: './revision-pagos.html',
  styleUrl: './revision-pagos.css',
})
export class RevisionPagos implements OnInit {
  pagos: AdminPago[] = [];

  cargando = false;
  error = '';

  constructor(private adminPagoService: AdminPagoService) {}

  ngOnInit(): void {
    this.cargarPagos();
  }

  cargarPagos(): void {
    this.cargando = true;
    this.error = '';

    this.adminPagoService.obtenerPagosEnRevision().subscribe({
      next: (response) => {
        this.pagos = response.data;
        this.cargando = false;
      },

      error: (error) => {
        console.error(error);
        this.error = 'No se pudieron cargar los pagos en revisión.';
        this.cargando = false;
      },
    });
  }

  aprobarPago(pago: AdminPago): void {
    this.adminPagoService.aprobarPago(pago.id).subscribe({
      next: () => {
        this.eliminarDeRevision(pago.id);
      },
      error: (error) => {
        console.error(error);

        this.error = 'no se pudo aprobar el pago';
      },
    });
  }

  verComprobante(pago: AdminPago): void {
    this.adminPagoService.obtenerComprobante(pago.id).subscribe({
      next: (archivo) => {
        const url = URL.createObjectURL(archivo);
        window.open(url, '_blank', 'nopopener, noreferrer');
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      },
      error: (error) => {
        console.error(error);
        this.error = 'No se pudo cargar el comprobante';
      },
    });
  }

  private eliminarDeRevision(pagoId: number): void {
    this.pagos = this.pagos.filter((pago) => pago.id !== pagoId);
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
}
