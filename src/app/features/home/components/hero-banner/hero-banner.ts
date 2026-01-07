import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-hero-banner',
  imports: [CommonModule],
  templateUrl: './hero-banner.html',
  styleUrl: './hero-banner.css'
})
export class HeroBanner implements OnInit, OnDestroy {
  currentSlide= 0;
  autoPlayInterval: any;

  slides = [
     {
      id: 1,
      image: 'assets/images/banners/hero-1.jpg',
      title: 'Instalaciones Profesionales',
      description: 'Servicios de ingeniería de calidad'
    },
    {
      id: 2,
      image: 'assets/images/banners/hero-2.jpg',
      title: 'Expertos en el Sector',
      description: 'Con experiencia y dedicación'
    },
    {
      id: 3,
      image: 'assets/images/banners/hero-3.jpg',
      title: 'Tecnología Avanzada',
      description: 'Soluciones innovadoras'
    },
    {
      id: 4,
      image: 'assets/images/banners/hero-4.jpg',
      title: 'Seguridad Garantizada',
      description: 'Cumplimiento de normativas'
    },
    {
      id: 5,
      image: 'assets/images/banners/hero-5.jpg',
      title: 'Trabajos de Precisión',
      description: 'Instalaciones confiables'
    }
  ]

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
      this.stopAutoPlay();
  }

  startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }
    nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.restartAutoPlay();
  }

  restartAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  onMouseEnter(): void {
    this.stopAutoPlay();
  }

  onMouseLeave(): void {
    this.startAutoPlay();
  }

    


}
