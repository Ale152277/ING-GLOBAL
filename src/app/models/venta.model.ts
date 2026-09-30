export interface DetalleVenta {
  id: number;
  productoId: number;
  nombreProducto: string;
  sku: string;
  cantidad: number;
  precioUnitario: number;
  descuentoAplicado: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  carritoId: number;
  usuarioId: number;
  fechaVenta: string;
  total: number;
  estado: string;
  detalles: DetalleVenta[];
}