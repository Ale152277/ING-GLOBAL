import { Producto } from "./producto.model";

export interface DetalleCarrito{
    id: number;
    productoId: number;
    producto: Producto;
    cantidad: number;
    precioUnitario: number;
    descuento: number;
    subtotal: number;
}

export interface Carrito{
    id: number;
    usuarioId: number;
    estado: string;
    fechaCreacion: string;
    fechaEnvioWhatsapp?: string;
    detalles: DetalleCarrito[];
    total?: number;
}

export interface AgregarAlCarrito{
    productoId: number;
    cantidad: number;
}