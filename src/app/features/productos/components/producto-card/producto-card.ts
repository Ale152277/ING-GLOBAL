import { Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Producto } from '../../../../models/producto.model';
import { CarritoService } from '../../../carrito/service/carrito.service';
import { AuthService } from '../../../../core/services/auth.service';
@Component({
  selector: 'app-producto-card',
  imports: [CommonModule],
  templateUrl: './producto-card.html',
  styleUrl: './producto-card.css',
})
export class ProductoCard implements OnInit {
  @Input() producto!: Producto;
  @Output() agregarAlCarrito = new EventEmitter<Producto>();
  @Output() agregarDeseados = new EventEmitter<Producto>();
  @Output() compartir = new EventEmitter<Producto>();

  usuarioAutenticado = false;
  isLoading = false;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService,
    private router: Router  
  ){}


  ngOnInit(): void {
    this.usuarioAutenticado = this.authService.estaAutenticado();
  }

  getPrecioFinal(): number{
    if(this.producto.descuento){
      this.producto.precio - (this.producto.precio * this.producto.descuento / 100)
    }
    return this.producto.precio
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(precio);
  }

  onAgregarAlCarrito(): void{
    if(!this.usuarioAutenticado){
      this.router.navigate(['/auth/login']);
      return;
    }
    this.isLoading = true;
    const usuario = this.authService.obtenerUsuario();

    if(!usuario){
      this.router.navigate(['/auth/login']);
      return;
    }

    this.carritoService.agregarProducto(usuario.id,{
      productoId: this.producto.id,
      cantidad: 1
    }).subscribe({
      next:()=>{
        this.isLoading= false;
        this.agregarAlCarrito.emit(this.producto)
      },
      error:(error)=>{
        console.error('Error al agregar al carrito', error);
        this.isLoading= false
      }
    })
  }

  onAgregarDeseados(): void{
    if(!this.usuarioAutenticado){
      this.router.navigate(['/auth/login']);
      return;
    }
    this.agregarDeseados.emit(this.producto);
  }

  onCompartir(): void{
    this.compartir.emit(this.producto);
  }
}