import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../../models/producto.model';
@Component({
  selector: 'app-producto-card',
  imports: [CommonModule],
  templateUrl: './producto-card.html',
  styleUrl: './producto-card.css',
})
export class ProductoCard {
  @Input() producto!: Producto;
  @Output() agregarAlCarrito = new EventEmitter<Producto>();
  @Output() agregarDeseados = new EventEmitter<Producto>();
  @Output() compartir = new EventEmitter<Producto>();

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
    this.agregarAlCarrito.emit(this.producto);
  }

  onAgregarDeseados(): void{
    this.agregarDeseados.emit(this.producto);
  }

  onCompartir(): void{
    this.compartir.emit(this.producto);
  }
}