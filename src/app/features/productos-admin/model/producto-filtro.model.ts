import { Producto } from "../../productos/models/producto.model";

export interface FiltrosProductoAdmin {
  texto?: string;
  precioMin?: number | null;
  precioMax?: number | null;
  stockMin?: number | null;
  stockMax?: number | null;
  estado?: Producto['estado'] | '';
}