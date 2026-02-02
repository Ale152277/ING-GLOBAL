export interface Marca{
    id: number;
    nombre: string;
    logo?: string;
    estado: 'ACTIVO' | 'INACTIVO';
}