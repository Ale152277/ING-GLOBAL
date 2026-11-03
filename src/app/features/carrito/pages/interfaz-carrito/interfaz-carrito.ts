import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgregarAlCarrito, Carrito, DetalleCarrito } from '../../../../models/carrito.model';
import { CarritoService } from '../../services/carrito.service';
import { Router, RouterLink } from '@angular/router';
import { VentaService } from '../../../ventas/venta.service';
import { ConfirmarPedidoModal } from '../../components/confirmar-pedido-modal/confirmar-pedido-modal';
import { WhatsappService } from '../../services/whatsapp.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Usuario } from '../../../../models/usuario.model';
import { CrearVentaRequest } from '../../../../models/venta.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { ModalConfirmacion } from '../../../../shared/components/modal-confirmacion/modal-confirmacion';

@Component({
  selector: 'app-interfaz-carrito',
  imports: [CommonModule, RouterLink, ConfirmarPedidoModal, ModalConfirmacion],
  templateUrl: './interfaz-carrito.html',
  styleUrl: './interfaz-carrito.css',
})
export class InterfazCarrito implements OnInit {
  carrito: Carrito | null = null;
  isloading = false;
  error = '';
  mensajeExito = '';
  mostrarConfirmacionPedido = false;
  mostrarConfirmacionVaciar = false;
  mostrarConfirmacionWhatsapp = false;
  enviandoWhatsapp = false;
  vaciando = false;

  usuario: Usuario | null = null;

  constructor(
    private carritoService: CarritoService,
    private ventaService: VentaService,
    private router: Router,
    private whatsappService: WhatsappService,
    private authService: AuthService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuario() as Usuario | null;
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

  obtenerNombre(detalle: DetalleCarrito): string {
    return detalle.producto?.nombre || detalle.presentacionProducto?.nombreProducto || 'Producto';
  }

  obtenerImagen(detalle: DetalleCarrito): string | undefined {
    return detalle.producto?.imagen || detalle.presentacionProducto?.imagen;
  }

  obtenerPrecioUnitarioFinal(detalle: DetalleCarrito): number {
    return detalle.subtotal / detalle.cantidad;
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

    this.carritoService.actualizarCantidad(detalle.id, this.carrito.id, nuevaCantidad).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.carrito = response.data;
        }
      },
      error: (error) => {
        console.error('Error al actualizar la cantidad', error);
        this.error = 'No se pudo actualizar la cantidad';
      },
    });
  }

  eliminarProducto(detalle: DetalleCarrito): void {
    if (!this.carrito) return;

    const nombre = this.obtenerNombre(detalle);
    // El backend ignora en silencio un request sin productoId ni presentacionId,
    // así que sin ninguno de los dos no se ofrece "Deshacer".
    const solicitud = this.crearSolicitudRestauracion(detalle);

    this.carritoService.eliminarProducto(detalle.id, this.carrito.id).subscribe({
      next: () => {
        this.carrito!.detalles = this.carrito!.detalles.filter((d) => d.id !== detalle.id);
        this.carritoService.actualizarBehaviorSubject(this.carrito!);

        this.toastService.mostrar(`${nombre} eliminado del carrito`, {
          duracion: 6000,
          icono: 'fa-circle-xmark',
          accion: solicitud
            ? {
                etiqueta: 'Deshacer',
                ejecutar: () => this.restaurarProducto(nombre, solicitud),
              }
            : undefined,
        });
      },
      error: (error) => {
        console.error('Error al eliminar producto:', error);
        this.error = 'Error al eliminar el producto';
      },
    });
  }

  private crearSolicitudRestauracion(detalle: DetalleCarrito): AgregarAlCarrito | null {
    const { presentacionProducto, producto, cantidad } = detalle;

    if (presentacionProducto?.id) {
      return { presentacionId: presentacionProducto.id, cantidad };
    }

    if (producto?.id) {
      return { productoId: producto.id, cantidad };
    }

    return null;
  }

  // El backend no tiene "restaurar": deshacer vuelve a agregar el producto con su cantidad
  // (el detalle nuevo puede quedar al final de la lista).
  private restaurarProducto(nombre: string, solicitud: AgregarAlCarrito): void {
    this.carritoService.agregarProducto(solicitud).subscribe({
      next: (response) => {
        if (response.data) {
          this.carrito = response.data;
        }
      },
      error: (error) => {
        console.error('Error al restaurar producto:', error);
        this.toastService.error(error.error?.message || `No se pudo restaurar ${nombre}`);
      },
    });
  }

  solicitarVaciarCarrito(): void {
    if (!this.carrito || this.carrito.detalles.length === 0) return;
    this.mostrarConfirmacionVaciar = true;
  }

  cancelarVaciarCarrito(): void {
    this.mostrarConfirmacionVaciar = false;
  }

  vaciarCarrito(): void {
    if (!this.carrito || this.vaciando) return;

    this.vaciando = true;

    this.carritoService.varciarCarrito(this.carrito.id).subscribe({
      next: () => {
        this.carrito!.detalles = [];
        this.carritoService.actualizarBehaviorSubject(this.carrito!);
        this.vaciando = false;
        this.mostrarConfirmacionVaciar = false;
      },
      error: (error) => {
        console.error('Error al vaciar el carrito:', error);
        this.error = 'Error al vaciar el carrito';
        this.vaciando = false;
        this.mostrarConfirmacionVaciar = false;
      },
    });
  }

  solicitarCompraWhatsapp(): void {
    if (!this.carrito || this.carrito.detalles.length === 0) {
      this.error = 'el carrito está vacío';
      return;
    }

    this.mostrarConfirmacionWhatsapp = true;
  }

  cancelarCompraWhatsapp(): void {
    this.mostrarConfirmacionWhatsapp = false;
  }

  Comprar(): void {
    if (!this.carrito || this.carrito.detalles.length === 0 || this.enviandoWhatsapp) {
      return;
    }

    this.enviandoWhatsapp = true;

    this.carritoService.enviarWhatsapp(this.carrito.id).subscribe({
      next: (response) => {
        if (response.success) {
          const urlWhtatsapp = this.whatsappService.generarUrl(this.carrito!);

          window.open(urlWhtatsapp, '_blank');

          this.carrito = null;
          this.carritoService.limpiarCarritoLocal();
        }

        this.enviandoWhatsapp = false;
        this.mostrarConfirmacionWhatsapp = false;
      },
      error: (error) => {
        console.error('Error al enviar el carrito por WhatsApp:', error);
        this.error = 'Error al procesar la compra';
        this.enviandoWhatsapp = false;
        this.mostrarConfirmacionWhatsapp = false;
      },
    });
  }

  realizarPedido(request: CrearVentaRequest): void {

    if(this.isloading) return;

    if (!this.carrito || this.carrito.detalles.length === 0) {
      this.error = 'El carrito está vacio';
      return;
    }

    this.isloading = true;
    this.error = '';
    this.mensajeExito = '';

    this.ventaService.crearVenta(request).subscribe({
    next: (response) => {
      this.isloading = false;

      if (!response.success || !response.data) {
        this.error = response.message || 'No se pudo crear el pedido';
        return;
      }

      this.mostrarConfirmacionPedido = false;
      this.carrito = null;
      this.carritoService.limpiarCarritoLocal();

      this.router.navigate(['/pago', response.data.id]);
    },
    error: (error) => {
      this.isloading = false;
      this.error = error.error?.message || 'No pudimos crear el pedido';
    },
  });
}

  solicitarConfirmacionPedido(): void {
    if (!this.carrito || this.carrito.detalles.length === 0) {
      this.error = 'El carrito está vacio';
      return;
    }
    this.mostrarConfirmacionPedido = true;
  }

  cancelarPedido(): void {
    this.mostrarConfirmacionPedido = false;
  }
}
