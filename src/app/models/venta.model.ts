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
  fechaVenta: string;
  total: number;
  estado: string;
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