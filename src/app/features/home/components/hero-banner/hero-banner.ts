import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-banner.html',
  styleUrl: './hero-banner.css'
})
export class HeroBanner {
  currentSlide = 0;

  slides = [
    {
      id: 1,
      image: 'assets/Banners/banner-7.jpeg',
      title: 'SOLUCIONES INTEGRALES TI',
      description: 'Soluciones Integrales de Infraestructura, Redes y Comunicaciones'
    },
    {
      id: 2,
      image: 'assets/Banners/banner-8.jpeg',
      title: 'SEGURIDAD ELECTRÓNICA',
      description: 'Sistemas de CCTV, Control de Acceso, Sistemas Contra Incendio, Sistemas anti-intrusión'
    },
    {
      id: 3,
      image: 'assets/Banners/banner-9.jpeg',
      title: 'SERVICIOS DE TELECOMUNICACIONES',
      description: 'Radio enlaces en VHF, UHF, Wireless LAN y Microondas'
    },
    {
      id: 4,
      image: 'assets/Banners/banner-10.jpeg',
      title: 'MANTENIMIENTO INDUSTRIAL',
      description: 'Garantizamos maximizar la eficiencia y seguridad de tu industria'
    },
    {
      id: 5,
      image: 'assets/Banners/banner-11.jpeg',
      title: 'CLIENTES',
      description: ''
    }
  ];

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  onMouseEnter(): void {
    // Pausa autoplay (cuando lo agreguemos)
  }

  onMouseLeave(): void {
    // Reanuda autoplay (cuando lo agreguemos
  }
}