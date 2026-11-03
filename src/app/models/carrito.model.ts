import { Producto } from "../features/productos/models/producto.model";


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
    carritoId?: number;
    producto?: Producto;
    presentacionProducto?: PresentacionProducto;
    cantidad: number;
    /** Precio de lista (sin descuento). */
    precioUnitario: number;
    /** Porcentaje de descuento aplicado. */
    descuentoAplicado: number;
    /** Ya incluye el descuento: precioUnitario * (1 - descuento) * cantidad. */
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