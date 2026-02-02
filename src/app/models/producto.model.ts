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
  categoriaId?: number;
  categoriaNombre?: string;
  marcaNombre?: string;      
  marcaId?: number;
  estado: 'ACTIVO' | 'INACTIVO'
  createdAt?: string;
  updatedAt?: string;

}