export interface Categoria {
  id: string;
  nombre: string;
  count: number;
}

export interface FiltrosProductos {
  categoria: string;
  searchTerm: string;
}