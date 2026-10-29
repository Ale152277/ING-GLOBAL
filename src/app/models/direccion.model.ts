export interface Direccion {
  id: number;
  alias: string;
  nombreReceptor: string;
  telefono: string;
  departamento: string;
  provincia: string;
  distrito: string;
  direccion: string;
  referencia: string | null;
  codigoPostal: string | null;
  predeterminada: boolean;
}

export interface DireccionRequest {
  alias: string;
  nombreReceptor: string;
  telefono: string;
  departamento: string;
  provincia: string;
  distrito: string;
  direccion: string;
  referencia?: string | null;
  codigoPostal?: string | null;
  predeterminada?: boolean;
}