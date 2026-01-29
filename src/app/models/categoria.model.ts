export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  count?: number;
}

export interface FiltrosProductos {
  categoria?: string;
  searchTerm?: string;
  precioMin?: number;
  precioMax?: number;
  ordenar?: string;
}