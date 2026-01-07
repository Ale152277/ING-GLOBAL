import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroBanner } from './components/hero-banner/hero-banner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroBanner],
  template: `
    <div>
      <app-hero-banner></app-hero-banner>
    </div>
  `
})
export class HomeComponent {}