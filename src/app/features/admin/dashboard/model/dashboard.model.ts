export interface PedidoMes {
  mes: string;
  total: number;
}

export type EstadoPedidoDashboard = 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA';

export interface PedidoReciente {
  id: number;
  cliente: string;
  fecha: string;
  total: number;
  estado: EstadoPedidoDashboard;
}

export interface ProductoStockBajo {
  id: number;
  nombre: string;
  sku: string;
  stock: number;
  imagen?: string;
}

export type EstadoConsultaDashboard = 'PENDIENTE' | 'RESPONDIDA';

export interface ConsultaReciente {
  id: number;
  nombreCliente: string;
  email: string;
  asunto: string;
  fecha: string;
  estado: EstadoConsultaDashboard;
}
