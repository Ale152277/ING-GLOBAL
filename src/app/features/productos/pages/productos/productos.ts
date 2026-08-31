import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../../models/producto.model';
import { Categoria } from '../../../../models/categoria.model';
import { ProductoCard } from '../../components/producto-card/producto-card';
import { ProductosService } from '../../services/productos.service';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule, ProductoCard, RouterLink],
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

  isAdmin : boolean = false;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private productoService: ProductosService,
    private categoriaService: CategoriaService,
    private authService: AuthService,
    private route:ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();

     this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.currentPage = 1;
      this.selectedCategoria = +params['categoriaId']; 
      this.cargarProductos();
  });
    
    this.searchSubject.pipe(debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe((termino) => {
        this.currentPage = 1;
        if (termino.trim()) {
          this.buscarProductos(termino);
        } else {
          this.cargarProductos();
        }
      });

    this.cargarCategorias();
    this.cargarProductos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
          console.error('error al cargar productos:', error), 
          this.isLoading = false;
        },
      });
  }
  
  buscarProductos(termino: string): void {
    this.isLoading = true;
    this.productoService
      .buscarProductos(termino, this.currentPage, this.productosPorPagina)
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
          console.error('error al buscar productos:', error);
          this.isLoading = false;
        },
      });
  }
 onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
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
        return 'precio-asc';
      case 'mayor-precio':
        return 'precio-desc';
      case 'mas-vendidos':
        return 'rating-desc';
      case 'nuevos':
        return 'newest';
      default:
        return undefined;
    }
  }

 onCategoriaChange():void{
  this.currentPage = 1;
  this.searchTerm = '';
  this.cargarProductos();
 }

  onOrdenamiento(): void {
    this.currentPage = 1;
    this.cargarProductos();
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
      currency: 'PEN',
    }).format(precio);
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
      this.cargarProductos();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPaginasDisponibles(): number[] {
    const paginas = [];
    for (let i = 1; i <= this.totalPages; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  onAgregarCarrito(producto: Producto): void {
    console.log('Agregado al carrito:', producto.nombre);
  }

 
  onAgregarDeseos(producto: Producto): void {
    console.log('Agregado a deseos:', producto.nombre);
  }

  
  onCompartir(producto: Producto): void {
    console.log('Compartiendo:', producto.nombre);
  }
}
