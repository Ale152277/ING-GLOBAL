import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../../models/producto.model';
import { ProductoCard } from '../../components/producto-card/producto-card';
import { PRODUCTOS_DATA, CATEGORIAS } from '../../../../data/producto.data';
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

  todosProductos: Producto[] = PRODUCTOS_DATA;

  categorias = JSON.parse(JSON.stringify(CATEGORIAS))

  constructor() {
    this.actualizarConteos();
  }

  actualizarConteos(): void {
    this.categorias.forEach((categoria:any) => {
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
