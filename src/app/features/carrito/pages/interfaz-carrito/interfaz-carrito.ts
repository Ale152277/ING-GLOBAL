import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Carrito, DetalleCarrito } from '../../../../models/carrito.model';
import { AuthService } from '../../../../core/services/auth.service';
import { CarritoService } from '../../service/carrito.service';


@Component({
  selector: 'app-interfaz-carrito',
  imports: [CommonModule, RouterLink],
  templateUrl: './interfaz-carrito.html',
  styleUrl: './interfaz-carrito.css',
})
export class InterfazCarrito implements OnInit{

  carrito : Carrito |null = null;
  isloading = false;
  error = '';
  usuarioId: number | null = null;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService
  ){}

  ngOnInit(): void {
      this.cargarCarrito();
  }

  private cargarCarrito(): void{
    const usuario = this.authService.obtenerUsuario();
    if(!usuario){
      this.error = 'Usuario no autenticado';
      return;
    }

    this.usuarioId= usuario.id
    this.isloading = true;

    this.carritoService.obtenerCarrito(usuario.id).subscribe({
      next:(response)=>{
        if(response.success && response.data){
          this.carrito = response.data;
        }
        this.isloading = false;
      },
      error:(error)=>{
        console.error('Error al cargar el carrito:', error);
        this.error = 'Error al cargar el carrito';
        this.isloading = false;
      }
    })
  }

  obtenerCantidadTotal():number{
    return this.carritoService.obtenerCantidadProductos(this.carrito!);
  }

  obtenerTotal(): number{
    return this.carritoService.obtenerTotal(this.carrito!);
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(precio);
  }

  eliminarProducto(dettalle: DetalleCarrito):void{
    if(!this.carrito) return;
    this.carritoService.eliminarProducto(dettalle.id, this.carrito.id).subscribe({
      next:()=>{
        this.cargarCarrito();
      },
      error : (error)=>{
        console.error('Error al eliminar producto:', error);
        this.error= 'Error al eliminar el producto'
      }
    })
  }

  vaciarCarrito():void{
    if(!this.carrito || !confirm ('¿Estás seguro de querer vaciar este carrito?')){
       return;
    }
    this.carritoService.varciarCarrito(this.carrito.id).subscribe({
      next:()=>{
        this.carrito = null;
      },
      error:(error)=>{
        console.error('Error al vaciar el carrito:', error);
        this.error = 'Error al vaciar el carrito';
      },
    })
  }


  Comprar():void{
    if(!this.carrito || this.carrito.detalles.length === 0){
      this.error ='el carrito está vacío';
      return;
    }

    this.isloading = true;

    this.carritoService.enviarWhatsapp(this.carrito.id).subscribe({
      next:(response)=>{
        if(response.success){
          const urlWhtatsapp = this.carritoService.generarURLWhatsapp(this.carrito!)

          window.open(urlWhtatsapp, '_blank');
        
        this.carrito = null;
        }

        this.isloading = false;
      },
      error:(error)=>{
        console.error('Error al enviar el carrito por WhatsApp:', error);
        this.error = 'Error al procesar la compra';
        this.isloading = false;
      }
        


    })

  }
}
