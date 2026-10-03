import { Component, input, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductoStockBajo } from '../../model/dashboard.model';
@Component({
  selector: 'app-productos-stock-bajo',
  imports: [RouterLink],
  templateUrl: './productos-stock-bajo.html',
  styleUrl: './productos-stock-bajo.css',
})
export class ProductosStockBajo {

  @Input() productos : ProductoStockBajo[] = [];

  obtenerClaseStock(stock: number): string{
    if(stock <= 5){
      return 'stock-critico'
    }else{
      return 'stock-bajo'
    }
  }

}
