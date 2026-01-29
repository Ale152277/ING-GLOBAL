import { Usuario } from './usuario.model';

export interface LoginRequest {
  email: string;
  contraseña: string;
}

export interface RegistroRequest {
  nombreCompleto: string;
  email: string;
  contraseña: string;
  telefono: string;
  direccion: string;
}

export interface TokenResponse {
  token: string;
  tipo: string;
  expiresIn: number;
  usuario: Usuario;
}