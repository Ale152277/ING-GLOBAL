import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagoService } from '../../service/pago.service';
import { Pago } from '../../models/pago.model';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PagoTemporizadorService } from '../../service/pago-temporizador.service';
import { ComprobantePago } from '../../components/comprobante-pago/comprobante-pago';
import { InstruccionesPago } from '../../components/instrucciones-pago/instrucciones-pago';
import { RouterLink } from '@angular/router';
import { ResumenPago } from '../../components/resumen-pago/resumen-pago';
import { EstadoPago } from '../../components/estado-pago/estado-pago';
@Component({
  selector: 'app-pago-pedido',
  imports: [CommonModule, ComprobantePago, RouterLink, InstruccionesPago, EstadoPago, ResumenPago],
  templateUrl: './pago-pedido.html',
  styleUrl: './pago-pedido.css',
})
export class PagoPedido implements OnInit, OnDestroy {
  ventaId: Number | null = null;
  pago: Pago | null = null;
  cargando = false;
  error = '';
  segundosRestantes = 0;

  private temporizadorSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private pagoService: PagoService,
    private pagoTemporizadorService: PagoTemporizadorService,
  ) {}

  ngOnInit(): void {
    this.obtenerVentaDesdeRuta();
  }

  ngOnDestroy(): void {
    this.detenerTemporizador();
  }
  private obtenerVentaDesdeRuta(): void {
    const ventaId = Number(this.route.snapshot.paramMap.get('ventaId'));

    if (!ventaId || ventaId <= 0) {
      this.error = 'El pedido indicado no es valido';
      return;
    }

    this.ventaId = ventaId;
    this.cargarPago();
  }

  private cargarPago(): void {
    if (!this.ventaId) {
      return;
    }

    this.cargando = true;
    this.error = '';

    this.pagoService.obtenerPagosDeVenta(this.ventaId).subscribe({
      next: (response) => {
        if (response.success && response.data && response.data.length > 0) {
          this.pago = response.data[0];
          this.iniciarTemporizador();
        } else {
          this.error = 'No encontramos información de pago para este pedido';
        }

        this.cargando = false;
      },

      error: (error) => {
        console.error('Error al obtener el pago:', error);

        this.error = error.error?.message || 'No pudimos obtener la información del pago';

        this.cargando = false;
      },
    });
  }

  private iniciarTemporizador(): void {
    this.detenerTemporizador();

    if (!this.pago || this.pago.estadoPago !== 'PENDIENTE' || !this.pago.fechaExpiracionPago) {
      this.segundosRestantes = 0;

      return;
    }

    this.temporizadorSubscription = this.pagoTemporizadorService
      .crearCuentaRegresiva(this.pago.fechaExpiracionPago)
      .subscribe({
        next: (segundos) => {
          this.segundosRestantes = segundos;
        },

        complete: () => {
          this.temporizadorSubscription = null;
        },
      });
  }

  private detenerTemporizador(): void {
    this.temporizadorSubscription?.unsubscribe();

    this.temporizadorSubscription = null;
  }
  formatearTiempo(): string {
    return this.pagoTemporizadorService.formatearTiempo(this.segundosRestantes);
  }

  get plazoVencido(): boolean {
    return (
      this.pago?.estadoPago === 'EXPIRADO' ||
      (this.pago?.estadoPago === 'PENDIENTE' && this.segundosRestantes <= 0)
    );
  }

  actualizarPago(pago: Pago): void {
    this.pago = pago;

    if (pago.estadoPago !== 'PENDIENTE') {
      this.detenerTemporizador();
    }
  }
}
