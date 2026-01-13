import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../../models/producto.model';

@Component({
  selector: 'app-productos-destacados',
  imports: [CommonModule],
  templateUrl: './productos-destacados.html',
  styleUrl: './productos-destacados.css'
})

export class ProductosDestacados {
  
  productos: Producto[] = [
    {
      id: 1,
      nombre: 'H8C PRO 3MP - CAM IP PT EXT',
      precio: 299.99,
      imagen: 'assets/images/productos/h8c-pro.jpg',
      sku: 'CS-H8C-R200-1K3WKFL',
      categoria: 'Seguridad Electrónica',
      descuento: 15,
      etiqueta: 'HOT'
    },
    {
      id: 2,
      nombre: 'DISCO DURO PURPLE WD 4TB',
      precio: 149.99,
      imagen: 'assets/images/productos/disco-duro.jpg',
      sku: 'SE-HDD4TB',
      categoria: 'Almacenamiento',
      descuento: 10
    },
    {
      id: 3,
      nombre: 'H8C PRO 3MP - CAM IP INT',
      precio: 249.99,
      imagen: 'assets/images/productos/h8c-interior.jpg',
      sku: 'CS-H8C-R100-IK3WKFL',
      categoria: 'Seguridad Electrónica',
      etiqueta: 'NUEVO'
    },
    {
      id: 4,
      nombre: 'DVR TURBO HD 8 CANALES',
      precio: 399.99,
      imagen: 'assets/images/productos/dvr-8ch.jpg',
      sku: 'SE-DVR-8CH',
      categoria: 'Grabadores',
      descuento: 5
    },
    {
      id: 5,
      nombre: 'CABLE COAXIAL RG6 305M',
      precio: 45.99,
      imagen: 'assets/images/productos/cable-coaxial.jpg',
      sku: 'AC-RG6-305M',
      categoria: 'Accesorios'
    },
    {
      id: 6,
      nombre: 'FUENTE 12V 5A PROFESIONAL',
      precio: 79.99,
      imagen: 'assets/images/productos/fuente-12v.jpg',
      sku: 'AC-FUENTE-12V5A',
      categoria: 'Accesorios',
      etiqueta: 'STOCK'
    }
  ];

  getPrecioFinal(producto : Producto): number{
    if(producto.descuento){
      return producto.precio - (producto.precio * (producto.descuento / 100));
    }
    return producto.precio;
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-ES',{
      style: 'currency',
      currency: 'PEN'
    }).format(precio);
  }


  agregarAlCarrito(producto: Producto): void {
    console.log('Producto agregado al carrito:', producto.nombre);
  }}
