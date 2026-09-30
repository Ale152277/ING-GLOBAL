import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { VentaService } from '../../venta.service';
import {
  FiltrosVenta,
  Venta
} from '../../../../models/venta.model';

@Component({
  selector: 'app-mis-pedidos',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './mis-pedidos.html',
  styleUrl: './mis-pedidos.css',
})
export class MisPedidos implements OnInit {

  pedidos: Venta[] = [];

  cargando = false;
  error = '';

  paginaActual = 0;
  tamanioPagina = 6;
  totalPaginas = 0;
  totalElementos = 0;

  pedidoExpandidoId: number | null = null;

  filtros: FiltrosVenta = {
    estado: '',
    fechaDesde: '',
    fechaHasta: '',
    precioMin: null,
    precioMax: null,
  };

  constructor(
    private ventaService: VentaService
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.cargando = true;
    this.error = '';

    this.ventaService
      .obtenerMisVentas(
        this.paginaActual,
        this.tamanioPagina,
        this.filtros
      )
      .subscribe({
        next: (response) => {

          if (response.success && response.data) {
            this.pedidos = response.data.content;

            this.paginaActual = response.data.page;
            this.totalPaginas = response.data.totalPages;
            this.totalElementos = response.data.totalElements;
          }

          this.cargando = false;
        },

        error: (error) => {
          console.error(
            'Error al cargar pedidos:',
            error
          );

          this.error =
            error.error?.message ||
            'No pudimos cargar tus pedidos';

          this.cargando = false;
        },
      });
  }

  aplicarFiltros(): void {
    this.paginaActual = 0;
    this.pedidoExpandidoId = null;
    this.cargarPedidos();
  }

  limpiarFiltros(): void {
    this.filtros = {
      estado: '',
      fechaDesde: '',
      fechaHasta: '',
      precioMin: null,
      precioMax: null,
    };

    this.paginaActual = 0;
    this.cargarPedidos();
  }

  cambiarPagina(pagina: number): void {
    if (
      pagina < 0 ||
      pagina >= this.totalPaginas ||
      pagina === this.paginaActual
    ) {
      return;
    }

    this.paginaActual = pagina;
    this.pedidoExpandidoId = null;
    this.cargarPedidos();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  paginasVisibles(): number[] {
    return Array.from(
      { length: this.totalPaginas },
      (_, index) => index
    );
  }

  toggleDetalle(pedidoId: number): void {
    this.pedidoExpandidoId =
      this.pedidoExpandidoId === pedidoId
        ? null
        : pedidoId;
  }

  estaExpandido(pedidoId: number): boolean {
    return this.pedidoExpandidoId === pedidoId;
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(precio);
  }

  formatearFecha(fecha: string): string {
    return new Intl.DateTimeFormat('es-PE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(fecha));
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-warning text-dark';

      case 'CONFIRMADA':
        return 'bg-primary';

      case 'COMPLETADA':
        return 'bg-success';

      case 'CANCELADA':
        return 'bg-danger';

      default:
        return 'bg-secondary';
    }
  }
}