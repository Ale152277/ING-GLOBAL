import { DetalleVenta } from '../../../../models/venta.model';

export type EstadoPedidoAdmin = 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETA' | 'CANCELADA';

export type MetodoPagoAdmin = 'YAPE' | 'PLIN' | 'TRANSFERENCIA' | 'CONTRA_ENTREGA';

export type EstadoPagoAdmin = 'PENDIENTE' | 'PAGADO' | 'RECHAZADO' | 'REEMBOLSADO';

export interface AdminPedido {
  id: number;
  cliente: string;
  email: string;
  telefono: string | null;
  fechaVenta: string;
  total: number;
  estado: EstadoPedidoAdmin;
}

export interface AdminPedidoDetalle extends AdminPedido {
  nombreReceptor: string | null;
  telefonoEntrega: string | null;
  direccionEntrega: string | null;
  referenciaEntrega: string | null;

  metodoPago: MetodoPagoAdmin | null;
  estadoPago: EstadoPagoAdmin | null;

  detalles: DetalleVenta[];
}
