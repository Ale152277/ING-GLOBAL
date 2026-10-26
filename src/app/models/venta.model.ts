export type EstadoVenta = 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETA' | 'CANCELADA';

export type EstadoPagoVenta =
  | 'PENDIENTE'
  | 'EN_REVISION'
  | 'PAGADO'
  | 'RECHAZADO'
  | 'EXPIRADO'
  | 'REEMBOLSADO';

export type MetodoPago = 'YAPE' | 'PLIN' | 'TRANSFERENCIA_DIRECTA';

export interface DetalleVenta {
  id: number;
  productoId: number;
  nombreProducto: string;
  sku: string;
  imagenProducto?: string | null;
  cantidad: number;
  precioUnitario: number;
  descuentoAplicado: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  carritoId: number | null;
  usuarioId: number;

  nombreCliente: string;
  emailCliente: string;
  telefonoCliente: string | null;

  nombreReceptor: string | null;
  telefonoEntrega: string | null;
  direccionEntrega: string | null;
  referenciaEntrega: string | null;

  fechaVenta: string;
  fechaExpiracionPago: string | null;

  total: number;

  estado: EstadoVenta;
  estadoPago: EstadoPagoVenta | null;
  metodoPago: MetodoPago | null;

  detalles: DetalleVenta[];
}

export interface Pagina<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface FiltrosVenta {
  estado?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  precioMin?: number | null;
  precioMax?: number | null;
}

export interface CrearVentaRequest {
  nombreReceptor: string;
  telefonoEntrega: string;
  direccionEntrega: string;
  referenciaEntrega?: string;
  metodoPago: MetodoPago;
}
