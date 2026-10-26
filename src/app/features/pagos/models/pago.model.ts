import { MetodoPago } from '../../../models/venta.model';

export type EstadoPago =
  | 'PENDIENTE'
  | 'EN_REVISION'
  | 'PAGADO'
  | 'RECHAZADO'
  | 'EXPIRADO'
  | 'REEMBOLSADO';

export type ProveedorPago =
  | 'INTERNO'
  | 'CULQI';

export interface Pago {
  id: number;
  ventaId: number;

  metodoPago: MetodoPago;
  monto: number;
  estadoPago: EstadoPago;

  fechaCreacion: string;
  fechaComprobante: string | null;
  fechaPago: string | null;
  fechaExpiracionPago: string | null;
  fechaRevision?: string | null;

  comprobanteEnviado: boolean;
  motivoRechazo?: string | null;
}

export interface AdminPago {
  id: number;
  ventaId: number;

  usuarioId: number;
  nombreCliente: string;

  metodoPago: MetodoPago;
  proveedorPago: ProveedorPago;
  estadoPago: EstadoPago;

  monto: number;

  fechaCreacion: string;
  fechaComprobante: string | null;
  fechaPago: string | null;
  fechaExpiracionPago: string | null;
  fechaRevision: string | null;

  comprobanteDisponible: boolean;
  motivoRechazo?: string | null;
}
