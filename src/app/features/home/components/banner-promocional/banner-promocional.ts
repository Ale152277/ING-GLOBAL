import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-banner-promocional',
  imports: [CommonModule],
  templateUrl: './banner-promocional.html',
  styleUrl: './banner-promocional.css'
})
export class BannerPromocional {
  constructor(
    private router : Router,
    private route: ActivatedRoute

  ){}
  
  irAProductos() : void{
    this.router.navigate(['/productos'])
  }

  

  verMasInfo():void{
    console.log('Ver mas información de la promoción');
  }

}
