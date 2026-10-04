import { Component, OnInit } from '@angular/core';
import { DashboardResumen } from '../../components/dashboard-resumen/dashboard-resumen';
import { PedidosPorMes } from '../../components/pedidos-por-mes/pedidos-por-mes';
import { PedidosRecientes } from '../../components/pedidos-recientes/pedidos-recientes';
import { PedidoMes, PedidoReciente , ConsultaReciente, ProductoStockBajo} from '../../model/dashboard.model';
import { ProductosStockBajo } from '../../components/productos-stock-bajo/productos-stock-bajo';
import { ConsultasRecientes } from '../../components/consultas-recientes/consultas-recientes';
import { AdminDashboardService } from '../../services/admin-dashboard.service';
import { response } from 'express';

@Component({
  selector: 'app-admin-dashboard',
  imports: [DashboardResumen, PedidosPorMes, PedidosRecientes, ConsultasRecientes, ProductosStockBajo],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit{
  
  pedidosTotales = 0;
  pedidosPendientes = 0;
  pedidosCompletados = 0;

  productosActivos = 0;
  productosStockBajo = 0;

  pedidosPorMes: PedidoMes[] = [];
  pedidosRecientes: PedidoReciente[] = [];
  productosConStockBajo: ProductoStockBajo[] = [];

  consultasRecientes: ConsultaReciente[] = [];
  
  constructor(private adminDashboardService: AdminDashboardService){}


  ngOnInit(): void {
      this.cargarDashboard();
  }
  

  cargarDashboard(): void{
    this.adminDashboardService.obtenerDashboard().subscribe({
      next: (response) =>{
        if(!response.success){
          return;
        }

        const dashboard = response.data;

        this.pedidosTotales = dashboard.pedidosTotales;
        this.pedidosPendientes = dashboard.pedidosPendientes;
        this.pedidosCompletados = dashboard.pedidosCompletados;
        this.productosActivos = dashboard.productosActivos;
        this.productosStockBajo = dashboard.productosStockBajo;
        this.pedidosPorMes = dashboard.pedidosPorMes;
        this.pedidosRecientes = dashboard.pedidosRecientes;
        this.productosConStockBajo = dashboard.productosConStockBajo
      },
        error: (error) => {

        console.error(
          'Error al cargar el dashboard:',
          error
        );

      }
      
    })
  }
}
