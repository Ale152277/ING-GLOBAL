import { Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PresentacionProducto } from '../../../../models/carrito.model';
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
  @Input() presentacion?: PresentacionProducto;
  @Output() agregarAlCarrito = new EventEmitter<Producto>();
  @Output() agregarDeseados = new EventEmitter<Producto>();
  @Output() compartir = new EventEmitter<Producto>();

  isLoading = false;
  mensajeCompartido= '';

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

    const request = this.presentacion ? 
    {presentacionId : this.presentacion.id, cantidad: 1}:{productoId: this.producto.id, cantidad:1};

    this.carritoService.agregarProducto(usuario.id, request).subscribe({
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
    const url =`${window.location.origin}/productos/${this.producto.id}`
    const texto = `${this.producto.nombre} - S/${this.precioFinal.toFixed(2)}`;

    if(navigator.share){
      navigator.share({
        title: this.producto.nombre,
      text: texto,
      url: url,

      }).catch(()=>{})
      
    }else{
      navigator.clipboard.writeText(url).then(()=>{
        this.mensajeCompartido = '¡Enlace copiado!';
        setTimeout(() => {
          this.mensajeCompartido =''
        }, 2500);
      })
    }

    this.compartir.emit(this.producto);
  }
}