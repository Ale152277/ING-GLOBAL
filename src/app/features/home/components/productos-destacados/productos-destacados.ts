import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../../models/producto.model';
import { ProductosService } from '../../../productos/services/productos.service';
import { response } from 'express';

@Component({
  selector: 'app-productos-destacados',
  imports: [CommonModule],
  templateUrl: './productos-destacados.html',
  styleUrl: './productos-destacados.css'
})

export class ProductosDestacados implements OnInit{
  
 productos: Producto[] = [];
 isLoading: boolean = false;

 constructor (private productoService: ProductosService){}

 ngOnInit(): void {
     this.cargarProductosDestacados();
 }

 cargarProductosDestacados(): void{
  this.isLoading = true;

  this.productoService.obtenerPorEtiqueta('bestseller', 1, 5).subscribe({
    next: (response)=>{
      if(response.success && response.data){
        this.productos = response.data.content;
      }
      this.isLoading = false;
    },
    error: (error)=>{
      console.error('error al cargar productos:', error)
      this.isLoading = false;
    }
  })
 }

  getPrecioFinal(producto : Producto): number{
    if(producto.descuento){
      return producto.precio - (producto.precio * (producto.descuento / 100));
    }
    return producto.precio;
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-ES',{
      style: 'currency',
      currency: 'PEN'
    }).format(precio);
  }


  agregarAlCarrito(producto: Producto): void {
    console.log('Producto agregado al carrito:', producto.nombre);
  }}
