import { Component } from '@angular/core';
import { DashboardResumen } from '../../components/dashboard-resumen/dashboard-resumen';
import { PedidosPorMes } from '../../components/pedidos-por-mes/pedidos-por-mes';
import { PedidosRecientes } from '../../components/pedidos-recientes/pedidos-recientes';
import { PedidoMes, PedidoReciente , ConsultaReciente, ProductoStockBajo} from '../../model/dashboard.model';
import { ProductosStockBajo } from '../../components/productos-stock-bajo/productos-stock-bajo';
import { ConsultasRecientes } from '../../components/consultas-recientes/consultas-recientes';
@Component({
  selector: 'app-admin-dashboard',
  imports: [DashboardResumen, PedidosPorMes, PedidosRecientes, ConsultasRecientes, ProductosStockBajo],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  pedidosTotales = 127;
  pedidosPendientes = 18;
  pedidosCompletados = 96;

  productosActivos = 248;
  productosStockBajo = 12;

  pedidosPorMes: PedidoMes[] = [
    {
      mes: 'Abr',
      total: 8,
    },
    {
      mes: 'May',
      total: 12,
    },
    {
      mes: 'Jun',
      total: 10,
    },
    {
      mes: 'Jul',
      total: 16,
    },
    {
      mes: 'Ago',
      total: 14,
    },
    {
      mes: 'Sep',
      total: 19,
    },
  ];

  pedidosRecientes: PedidoReciente[] = [
    {
      id: 31,
      cliente: 'Cliente de prueba',
      fecha: '30/09/2026',
      total: 2247,
      estado: 'PENDIENTE',
    },
    {
      id: 30,
      cliente: 'Cliente ejemplo',
      fecha: '29/09/2026',
      total: 1299,
      estado: 'CONFIRMADA',
    },
    {
      id: 29,
      cliente: 'Cliente demostración',
      fecha: '28/09/2026',
      total: 899,
      estado: 'COMPLETADA',
    },
  ];
  productosConStockBajo: ProductoStockBajo[] = [
  {
    id: 1,
    nombre: 'DOMO IP 4MP DUAL LIGHT 2.8-12MM IR 30MTS',
    sku: 'HK-DS2CD1743G2-LIZU',
    stock: 3,
  },
  {
    id: 2,
    nombre: 'PT IP WIFI INTERIOR 2MP IR10M 4MM',
    sku: 'HK-DS2CV2Q21G1-IDW',
    stock: 5,
  },
  {
    id: 3,
    nombre: 'BULLET IP SMART HYBRID LIGHT',
    sku: 'HK-DS2CD1T67',
    stock: 8,
  },
];


consultasRecientes: ConsultaReciente[] = [
  {
    id: 1,
    nombreCliente: 'Cliente ejemplo',
    email: 'cliente1@ejemplo.com',
    asunto: 'Consulta sobre instalación',
    fecha: '02/10/2026',
    estado: 'PENDIENTE',
  },
  {
    id: 2,
    nombreCliente: 'Usuario demostración',
    email: 'cliente2@ejemplo.com',
    asunto: 'Disponibilidad de producto',
    fecha: '01/10/2026',
    estado: 'RESPONDIDA',
  },
  {
    id: 3,
    nombreCliente: 'Cliente de prueba',
    email: 'cliente3@ejemplo.com',
    asunto: 'Cotización para CCTV',
    fecha: '30/09/2026',
    estado: 'PENDIENTE',
  },
];
  
  
}
