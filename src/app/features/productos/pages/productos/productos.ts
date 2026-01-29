import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../../models/producto.model';
import { Categoria } from '../../../../models/categoria.model';
import { ProductoCard } from '../../components/producto-card/producto-card';
import { ProductosService } from '../../services/productos.service';
import { CategoriaService } from '../../../../core/services/categoria.service';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule, ProductoCard],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  selectedCategoria: number | null = null;
  searchTerm: string = '';
  ordernadoPor: string = 'destacados';

  currentPage: number = 1;
  productosPorPagina: number = 12;

  productosPaginados: Producto[] = [];
  categorias: Categoria[] = [];

  isLoading: boolean = false;
  totalPages: number = 0;
  totalProductos: number = 0;

  constructor(
    private productoService: ProductosService,
    private categoriaService: CategoriaService,
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.isLoading = true;

    this.productoService
      .obtenerProductos(
        this.currentPage,
        this.productosPorPagina,
        this.selectedCategoria || undefined,
        undefined,
        undefined,
        undefined,
        false,
        this.obtenerOrdenamiento(),
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.productosPaginados = response.data.content;
            this.totalPages = response.data.totalPages;
            this.totalProductos = response.data.totalElements;
          }
          this.isLoading = false;
        },
        error: (error) => {
          (console.error('error al cargar productos:', error), (this.isLoading = false));
        },
      });
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerTodas().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categorias = [{ id: 0, nombre: 'Todas', slug: 'Todas' }, ...response.data];
        }
      },
      error: (error) => {
        console.error('error al cargar categorias:', error);
      },
    });
  }
  obtenerOrdenamiento(): string | undefined {
    switch (this.ordernadoPor) {
      case 'menor-precio':
        return 'precio_asc';
      case 'mayor-precio':
        return 'precio_desc';
      case 'mas-vendidos':
        return 'rating_desc';
      case 'nuevos':
        return 'newest';
      default:
        return undefined;
    }
  }

  onCategoriaChange(): void {
    this.currentPage = 1;
    this.cargarProductos();
  }

  onBuscar(): void {
    if (this.searchTerm.trim()) {
      //PARA QUE SIRVE EL TRIM
      this.isLoading = true;
      this.currentPage = 1;
      this.productoService
        .buscarProductos(this.searchTerm, this.currentPage, this.productosPorPagina)
        .subscribe({
          next: (response) => {
            if (response.success && response.data) {
              this.productosPaginados = response.data.content;
              this.totalPages = response.data.totalElements; //como saben llamar a totalelements si es de otra clase que no se ha llamado ? (api-response.model)

              this.totalProductos = response.data.totalElements;
            }
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error al buscar productos:', error);
            this.isLoading = false;
          },
        });
    } else {
      this.cargarProductos();
    }
  }

  onOrdenamiento(): void{
    this.currentPage = 1;
    this.cargarProductos();
  }


  getPrecioFinal(producto:Producto): number{
    if(producto.descuento){
      return producto.precio - (producto.precio * producto.descuento/100);
    }

    return producto.precio;
  }

  formatearPrecio(precio:number): string{
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(precio);
  }


  irAPagina(pagina:number): void{
    if(pagina >= 1 && pagina <= this.totalPages){
      this.currentPage = pagina;
      this.cargarProductos();
      window.scrollTo({top:0, behavior: 'smooth'});    
    }
  }

  getPaginasDisponibles(): number[]{
    const paginas = [];
    for( let i = 1; i <= this.totalPages; i++){
      paginas.push(i);
    }
    return paginas
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
  }
}
