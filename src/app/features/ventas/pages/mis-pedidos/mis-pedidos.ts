import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { FiltrosVenta, Venta } from '../../../../models/venta.model';
import { PedidoCard } from '../../components/pedido-card/pedido-card';
import { VentaService } from '../../venta.service';

@Component({
  selector: 'app-mis-pedidos',
  imports: [FormsModule, RouterLink, PedidoCard],
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

  filtros: FiltrosVenta = this.filtrosVacios();

  constructor(private ventaService: VentaService) {}

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
        this.filtros,
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
          this.error =
            error?.error?.message ||
            'No pudimos cargar tus pedidos.';
          this.cargando = false;
        },
      });
  }

  aplicarFiltros(): void {
    this.paginaActual = 0;
    this.cargarPedidos();
  }

  limpiarFiltros(): void {
    this.filtros = this.filtrosVacios();
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
    this.cargarPedidos();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  paginasVisibles(): number[] {
    return Array.from(
      { length: this.totalPaginas },
      (_, index) => index,
    );
  }

  private filtrosVacios(): FiltrosVenta {
    return {
      estado: '',
      fechaDesde: '',
      fechaHasta: '',
      precioMin: null,
      precioMax: null,
    };
  }
}
