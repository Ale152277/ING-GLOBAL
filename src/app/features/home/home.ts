import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroBanner } from './components/hero-banner/hero-banner';
import { ProductosDestacados } from './components/productos-destacados/productos-destacados';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroBanner, ProductosDestacados],
  template: `
    <div>
      <app-hero-banner></app-hero-banner>
      <app-productos-destacados></app-productos-destacados>

    </div>
  `
})
export class HomeComponent {}