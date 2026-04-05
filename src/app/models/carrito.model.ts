import { Producto } from "./producto.model";


export interface PresentacionProducto{
    id: number;
    productoId: number;
    nombreProducto: string;
    tipoPresentacionId?: number;
    tipoUnidadId?: number;
    tipoPresentacion?: string;
    tipoUnidad?: string;
    cantidadBase: number;
    precio: number;
    estado: string;
    imagen?: string;
}

export interface DetalleCarrito{
    id: number;
    productoId: number;
    producto?: Producto;
    presentacion?: PresentacionProducto;
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
    productoId?: number;
    presentacionId?: number;
    cantidad: number;
}