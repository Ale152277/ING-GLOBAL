export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  sku: string;
  categoria: string;
  descuento?: number;
  etiqueta?: string;
}