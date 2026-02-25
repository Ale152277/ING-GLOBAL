import { Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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

  isLoading = false;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService,
    private router: Router  
  ){}


  ngOnInit(): void {}

  get usuarioAutenticado():boolean{
    return this.authService.isAuthenticated();
  }

  get precioFinal(): number{
    if(this.producto.descuento){
      return this.producto.precio - (this.producto.precio * this.producto.descuento / 100)
    }
    return this.producto.precio
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(precio);
  }

  private requiereLogin():boolean{
    if(!this.usuarioAutenticado){
      this.router.navigate(['/auth/login'])
    }
    return false;
  }

  onAgregarAlCarrito(): void{
    if(this.requiereLogin()) return;
    this.isLoading = true;
    const usuario = this.authService.obtenerUsuario();

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
    if(this.requiereLogin()) return;
    this.agregarDeseados.emit(this.producto);
  }

  onCompartir(): void{
    this.compartir.emit(this.producto);
  }
}