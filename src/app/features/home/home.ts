import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroBanner } from './components/hero-banner/hero-banner';
import { ProductosDestacados } from './components/productos-destacados/productos-destacados';
import { BannerPromocional } from './components/banner-promocional/banner-promocional';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroBanner, ProductosDestacados, BannerPromocional],
  template: `
    <div>
      <app-hero-banner></app-hero-banner>
      
      <app-productos-destacados></app-productos-destacados>

      <app-banner-promocional></app-banner-promocional>

    </div>
  `
})
export class HomeComponent {}