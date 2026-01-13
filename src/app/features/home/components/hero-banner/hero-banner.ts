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
      image: 'assets/Banners/banner-4.png',
      title: 'Instalaciones Profesionales',
      description: 'Servicios de ingeniería de calidad'
    },
    {
      id: 2,
      image: 'assets/Banners/banner-2.png',
      title: 'Expertos en el Sector',
      description: 'Con experiencia y dedicación'
    },
    {
      id: 3,
      image: 'assets/Banners/banner-3.png',
      title: 'Tecnología Avanzada',
      description: 'Soluciones innovadoras'
    },
    {
      id: 4,
      image: 'assets/Banners/banner-6.jpg',
      title: 'Seguridad Garantizada',
      description: 'Cumplimiento de normativas'
    },
    {
      id: 5,
      image: 'assets/Banners/banner-5.jpg',
      title: 'Trabajos de Precisión',
      description: 'Instalaciones confiables'
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