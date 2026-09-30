import { Injectable } from '@angular/core';
import { Carrito } from '../../../models/carrito.model';

@Injectable({
  providedIn: 'root',
})
export class WhatsappService {
  private numeroEmpresa = '51973306855';

  generarMensaje(carrito: Carrito): string {
    let mensaje = '';

    mensaje += '*SOLICITUD DE PRODUCTOS - INGENIERÍA GLOBAL*\n\n';
    mensaje += 'Hola, deseo solicitar los siguientes productos:\n\n';

    carrito.detalles.forEach((detalle, index) => {
      const nombre = detalle.producto?.nombre || detalle.presentacion?.nombreProducto || 'Producto';

      const sku = detalle.producto?.sku;

      const imagen = detalle.producto?.imagen;

      mensaje += `*${index + 1}. ${nombre}*\n`;

      if (sku) {
        mensaje += `SKU: ${sku}\n`;
      }
      mensaje += `Cantidad: ${detalle.cantidad}\n`;
      mensaje += `Precio unitario: S/ ${detalle.precioUnitario.toFixed(2)}\n`;

      if (detalle.descuento > 0) {
        mensaje += `Descuento : ${detalle.descuento}%\n`;
      }

      mensaje += `Subtotal: S/ ${detalle.subtotal.toFixed(2)}\n`;

      if (imagen) {
        mensaje += `Imagen: ${imagen}\n`;
      }

      mensaje += '\n';
    });
    mensaje += '------------------------------\n\n';

    mensaje += `*TOTAL DEL PEDIDO: S/ ${this.obtenerTotal(carrito).toFixed(2)}*\n\n`;

    mensaje += 'Agradecería confirmar:\n';
    mensaje += '• Disponibilidad de los productos\n';
    mensaje += '• Forma de pago\n';
    mensaje += '• Entrega o recojo\n';
    mensaje += '• Soporte o instalación, si corresponde\n\n';

    mensaje += 'Gracias.';

    return mensaje;
  }

  generarUrl(carrito: Carrito): string {
    const mensaje = this.generarMensaje(carrito);

    return `https://wa.me/${this.numeroEmpresa}?text=${encodeURIComponent(mensaje)}`;
  }

  private obtenerTotal(carrito: Carrito): number {
    return carrito.detalles.reduce((total, detalle) => total + detalle.subtotal, 0);
  }
}
