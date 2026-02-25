import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../../models/producto.model';
import { ProductosService } from '../../../productos/services/productos.service';
import { ProductoCard } from '../../../productos/components/producto-card/producto-card';
import { response } from 'express';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-productos-destacados',
  imports: [CommonModule, ProductoCard, RouterLink],
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
}
