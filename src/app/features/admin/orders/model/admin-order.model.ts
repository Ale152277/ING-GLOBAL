export type EstadoPedidoAdmin = 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETA' | 'CANCELADA';

export interface AdminPedido {
  id: number;
  cliente: string;
  email: string;
  telefono: string | null;
  fechaVenta: string;
  total: number;
  estado: EstadoPedidoAdmin;
}
