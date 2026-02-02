export interface CrearProductoRequest {
  nombre: string;
  sku: string;
  precio: number;
  categoriaId: number;
  categoriaNombre?: string
  marcaId?: number;
  marcaNombre?: string;
  descripcion?: string;
  stock?: number;
  descuento?: number;
  etiqueta?: string;
  imagen?: string;
  rating?: number;
  estado?: string;
}

export interface EditarProductoRequest extends CrearProductoRequest {
  id: number;
}
