import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-banner-promocional',
  imports: [CommonModule],
  templateUrl: './banner-promocional.html',
  styleUrl: './banner-promocional.css'
})
export class BannerPromocional {
  irAProductos(){
    console.log('navegando a productos...');
  }

  verMasInfo():void{
    console.log('Ver mas información de la promoción');
  }

}
