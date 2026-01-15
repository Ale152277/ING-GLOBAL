import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../../models/producto.model';
import { ProductoCard } from '../../components/producto-card/producto-card';
@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule, ProductoCard],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos {
  selectedCategoria: string = 'todos';
  searchTerm: string = '';
  ordernadoPor: string = 'destacados';

  currentPage: number = 1;
  productosPorPagina: number = 12;

  todosProductos: Producto[] = [
    {
      id: 1,
      nombre: 'H8C PRO 3MP - CAM IP PT EXT',
      precio: 299.99,
      imagen: 'assets/images/productos/h8c-pro.jpg',
      sku: 'CS-H8C-R200-1K3WKFL',
      categoria: 'Cámaras IP',
      descuento: 15,
      etiqueta: 'HOT',
      rating: 4.5,
    },
    {
      id: 2,
      nombre: 'DISCO DURO PURPLE WD 4TB',
      precio: 149.99,
      imagen: 'assets/images/productos/disco-duro.jpg',
      sku: 'SE-HDD4TB',
      categoria: 'Almacenamiento',
      descuento: 10,
      rating: 4.0,
    },
    {
      id: 3,
      nombre: 'H8C PRO 3MP - CAM IP INT',
      precio: 249.99,
      imagen: 'assets/images/productos/h8c-interior.jpg',
      sku: 'CS-H8C-R100-IK3WKFL',
      categoria: 'Cámaras IP',
      etiqueta: 'NUEVO',
      rating: 4.8,
    },
    {
      id: 4,
      nombre: 'DVR TURBO HD 8 CANALES',
      precio: 399.99,
      imagen: 'assets/images/productos/dvr-8ch.jpg',
      sku: 'SE-DVR-8CH',
      categoria: 'Grabadores',
      descuento: 5,
      rating: 4.2,
    },
    {
      id: 5,
      nombre: 'CABLE COAXIAL RG6 305M',
      precio: 45.99,
      imagen: 'assets/images/productos/cable-coaxial.jpg',
      sku: 'AC-RG6-305M',
      categoria: 'Accesorios',
      rating: 3.9,
    },
    {
      id: 6,
      nombre: 'FUENTE 12V 5A PROFESIONAL',
      precio: 79.99,
      imagen: 'assets/images/productos/fuente-12v.jpg',
      sku: 'AC-FUENTE-12V5A',
      categoria: 'Accesorios',
      etiqueta: 'STOCK',
      rating: 4.3,
    },
    {
      id: 7,
      nombre: 'WALL PLATE 1 PUERTO',
      precio: 89.99,
      imagen: 'assets/images/productos/wall-plate.jpg',
      sku: 'NEW-4000001',
      categoria: 'Accesorios',
      rating: 4.1,
    },
    {
      id: 8,
      nombre: 'BULLET EXTERIOR 1080P IR 40M',
      precio: 179.99,
      imagen: 'assets/images/productos/bullet-exterior.jpg',
      sku: 'HK-DS2CE19D0T-VFIT3F',
      categoria: 'Cámaras Analógicas',
      descuento: 8,
      rating: 4.4,
    },
    {
      id: 9,
      nombre: 'DOMO IP 4MP DUAL LIGHT 2.8-12MM',
      precio: 349.99,
      imagen: 'assets/images/productos/domo-ip.jpg',
      sku: 'HK-DS2CD174362-LIZU',
      categoria: 'Cámaras IP',
      rating: 4.6,
    },
    {
      id: 10,
      nombre: 'NVR 16 CANALES 4K',
      precio: 599.99,
      imagen: 'assets/images/productos/nvr-16ch.jpg',
      sku: 'HK-DS7616NI-K2',
      categoria: 'Grabadores',
      descuento: 12,
      rating: 4.7,
    },
    {
      id: 11,
      nombre: 'SWITCH PoE 8 PUERTOS',
      precio: 199.99,
      imagen: 'assets/images/productos/switch-poe.jpg',
      sku: 'AC-SWITCH-8POE',
      categoria: 'Accesorios',
      rating: 4.2,
    },
    {
      id: 12,
      nombre: 'FUENTE 24V 10A INDUSTRIAL',
      precio: 129.99,
      imagen: 'assets/images/productos/fuente-24v.jpg',
      sku: 'AC-FUENTE-24V10A',
      categoria: 'Accesorios',
      rating: 4.0,
    },
  ];
  categorias = [
    { id: 'todos', nombre: 'Todos los productos', count: 0 },
    { id: 'camaras-ip', nombre: 'Cámaras IP', count: 0 },
    { id: 'camaras-analogicas', nombre: 'Cámaras Analógicas', count: 0 },
    { id: 'grabadores', nombre: 'Grabadores', count: 0 },
    { id: 'almacenamiento', nombre: 'Almacenamiento', count: 0 },
    { id: 'accesorios', nombre: 'Accesorios', count: 0 },
  ];

  constructor() {
    this.actualizarConteos();
  }

  actualizarConteos(): void {
    this.categorias.forEach((categoria) => {
      if (categoria.id === 'todos') {
        categoria.count = this.todosProductos.length;
      } else {
        const nombreCategoria = categoria.nombre;
        categoria.count = this.todosProductos.filter(
          (producto) => producto.categoria.toLowerCase() === nombreCategoria.toLowerCase()
        ).length;
      }
    });
  }

  mapearCategoria(id: string): string {
    const mapa: { [key: string]: string } = {
      'camaras-ip': 'Cámaras IP',
      'camaras-analogicas': 'Cámaras Analógicas',
      'grabadores': 'Grabadores',
      'almacenamiento': 'Almacenamiento',
      'accesorios': 'Accesorios',
    };
    return mapa[id] || '';
  }

  get productosFiltrados(): Producto[] {
    let resultado = this.todosProductos;

    if (this.selectedCategoria !== 'todos') {
      const categoria = this.mapearCategoria(this.selectedCategoria);
      resultado = resultado.filter((p) => p.categoria === categoria);
    }

    if (this.searchTerm.trim()) {
      resultado = resultado.filter(
        (p) =>
          p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    resultado = this.ordenarprodcutos(resultado);
    return resultado;
  }

  ordenarprodcutos(productos: Producto[]): Producto[] {
    const copia = [...productos];

    switch (this.ordernadoPor) {
      case 'menor-precio':
        return copia.sort((a, b) => a.precio - b.precio);
      case 'mayor-precio':
        return copia.sort((a, b) => b.precio - a.precio);
      case 'mas-vendidos':
        return copia.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'nuevos':
        return copia.reverse();
      default: 
        return copia;
    }
  }
  
  get productosPaginados(): Producto[] {
    const inicio = (this.currentPage - 1) * this.productosPorPagina;
    const fin = inicio + this.productosPorPagina;
    return this.productosFiltrados.slice(inicio, fin);
  }


   get totalPages(): number {
    return Math.ceil(this.productosFiltrados.length / this.productosPorPagina);
  }

   get paginasDisponibles(): number[] {
    const paginas = [];
    for (let i = 1; i <= this.totalPages; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  getPrecioFinal(producto: Producto): number {
    if (producto.descuento) {
      return producto.precio - (producto.precio * producto.descuento / 100);
    }
    return producto.precio;
  }

   formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(precio);
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

 onAgregarCarrito(producto: Producto): void {
    console.log('Agregado al carrito:', producto.nombre);
    // TODO: Conectar con servicio de carrito
  }

  /**
   * Agrega producto a deseos
   */
  onAgregarDeseos(producto: Producto): void {
    console.log('Agregado a deseos:', producto.nombre);
    // TODO: Conectar con servicio de wishlist
  }

  /**
   * Comparte el producto
   */
  onCompartir(producto: Producto): void {
    console.log('Compartiendo:', producto.nombre);
    // TODO: Implementar compartir en redes sociales
  }

}
