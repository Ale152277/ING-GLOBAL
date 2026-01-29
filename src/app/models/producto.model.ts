export interface Producto {
  id: number;
  nombre: string;
  sku: string;
  precio: number;
  descuento: number;
  etiqueta?: string;
  stock: number;
  descripcion: string;
  imagen?: string;
  rating?: number;
  estado: string;
  categoriaId?: number;
  marcaId?: number;
}