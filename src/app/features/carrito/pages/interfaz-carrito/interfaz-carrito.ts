import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carrito, DetalleCarrito } from '../../../../models/carrito.model';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';
import { VentaService } from '../../../ventas/venta.service';
import { ConfirmarPedidoModal } from '../../components/confirmar-pedido-modal/confirmar-pedido-modal';
import { WhatsappService } from '../../services/whatsapp.service';
@Component({
  selector: 'app-interfaz-carrito',
  imports: [CommonModule, ConfirmarPedidoModal],
  templateUrl: './interfaz-carrito.html',
  styleUrl: './interfaz-carrito.css',
})
export class InterfazCarrito implements OnInit {
  carrito: Carrito | null = null;
  isloading = false;
  error = '';
  mensajeExito = '';
  mostrarConfirmacionPedido = false;

  constructor(
    private carritoService: CarritoService,
    private ventaService: VentaService,
    private router: Router,
    private whatsappService: WhatsappService
  ) {}

  ngOnInit(): void {
    this.cargarCarrito();
  }

  private cargarCarrito(): void {
    
    this.isloading = true;

    this.carritoService.obtenerCarrito().subscribe({
      next: (response) => {
        if (response.success) {
          this.carrito = response.data;
        }
        this.isloading = false;
      },
      error: (error) => {
        console.error('Error al cargar el carrito:', error);
        this.error = 'Error al cargar el carrito';
        this.isloading = false;
      },
    });
  }

  obtenerCantidadTotal(): number {
    return this.carritoService.obtenerCantidadProductos(this.carrito!);
  }

  obtenerTotal(): number {
    return this.carritoService.obtenerTotal(this.carrito!);
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(precio);
  }

  actualizarCantidad(detalle: DetalleCarrito, incremento: number): void {
    if (!this.carrito) return;
    const nuevaCantidad = detalle.cantidad + incremento;

    if (nuevaCantidad <= 0) {
      this.eliminarProducto(detalle);
      return;
    }

    this.carritoService.actualizarCantidad(
      detalle.id,
      this.carrito.id,
      nuevaCantidad
    )
    .subscribe({
      next: (response) =>{
        if(response.success && response.data){
          this.carrito = response.data
        }
      },
      error: (error) => {
        console.error('Error al actualizar la cantidad', error);
        this.error = 'No se pudo actualizar la cantidad'  
      },
    })
  }

  eliminarProducto(dettalle: DetalleCarrito): void {
    if (!this.carrito) return;
    this.carritoService.eliminarProducto(dettalle.id, this.carrito.id).subscribe({
      next: () => {
        this.carrito!.detalles = this.carrito!.detalles.filter((d) => d.id !== dettalle.id);
        this.carritoService.actualizarBehaviorSubject(this.carrito!);
      },
      error: (error) => {
        console.error('Error al eliminar producto:', error);
        this.error = 'Error al eliminar el producto';
      },
    });
  }

  vaciarCarrito(): void {
    if (!this.carrito || !confirm('¿Estás seguro de querer vaciar este carrito?')) {
      return;
    }
    this.carritoService.varciarCarrito(this.carrito.id).subscribe({
      next: () => {
        this.carrito!.detalles = [];
        this.carritoService.actualizarBehaviorSubject(this.carrito!);
      },
      error: (error) => {
        console.error('Error al vaciar el carrito:', error);
        this.error = 'Error al vaciar el carrito';
      },
    });
  }

  Comprar(): void {
    if (!this.carrito || this.carrito.detalles.length === 0) {
      this.error = 'el carrito está vacío';
      return;
    }

    this.isloading = true;

    this.carritoService.enviarWhatsapp(this.carrito.id).subscribe({
      next: (response) => {
        if (response.success) {
          const urlWhtatsapp = this.whatsappService.generarUrl(this.carrito!);

          window.open(urlWhtatsapp, '_blank');

          this.carrito = null;
          this.carritoService.limpiarCarritoLocal();
        }

        this.isloading = false;
      },
      error: (error) => {
        console.error('Error al enviar el carrito por WhatsApp:', error);
        this.error = 'Error al procesar la compra';
        this.isloading = false;
      },
    });
  }

  realizarPedido():void{
    if(!this.carrito || this.carrito.detalles.length === 0){
      this.error = 'El carrito está vacio';
      return;
    }

    this.isloading = true;
    this.error= '';
    this.mensajeExito = '';

    this.ventaService.crearVenta().subscribe({
      next: (response) =>{
        if(response.success && response.data){
          this.mostrarConfirmacionPedido = false;
          this.mensajeExito = response.message ||  `Pedido #${response.data.id} realizado con éxito`;
        
          this.carrito = null;
          this.carritoService.limpiarCarritoLocal()
        }
         this.isloading = false
        
      },

      error: (error) =>{
        console.error("Error al crear el pedido", error);
        this.error = error.error?.message || "No pudimos crear el pedido"
        this.isloading = false
      }
      
    })
  }

  solicitarConfirmacionPedido(): void{
    if(!this.carrito || this.carrito.detalles.length ===0){
      this.error = "El carrito está vacio"
      return;
    }
    this.mostrarConfirmacionPedido = true;
  }
  
  cancelarPedido():void {
    this.mostrarConfirmacionPedido = false;
  }
}
