import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ImagenEquipo{
  id: number;
  src: string;
  alt: string;
  titulo: string;
}


@Component({
  selector: 'app-nosotros',
  imports: [CommonModule],
  templateUrl: './nosotros.html',
  styleUrl: './nosotros.css',
})
export class Nosotros {

  tabActivo : 'quienes' | 'mision' | 'valores' = 'quienes';

  currentImageIndex: number= 0;

  imagenesEquipo: ImagenEquipo[]=[
    {
      id: 1,
      src: 'assets/images/nosotros/equipo-1.jpg',
      alt: 'Equipo Ingeniería Global 1',
      titulo: 'Equipo de Profesionales'
    },
    {
      id: 2,
      src: 'assets/images/nosotros/equipo-2.jpg',
      alt: 'Equipo Ingeniería Global 2',
      titulo: 'Instalación en Campo'
    },
    {
      id: 3,
      src: 'assets/images/nosotros/equipo-3.jpg',
      alt: 'Equipo Ingeniería Global 3',
      titulo: 'Centro de Operaciones'
    }
  ];

  quienesSomos = `Somos una empresa especializada en soluciones integrales de infraestructura tecnológica e industrial, con más de 14 años de experiencia acompañando a empresas de distintos sectores en Trujillo y a nivel nacional en el diseño, implementación, operación y mantenimiento de sistemas tecnológicos, seguridad electrónica, sistemas eléctricos, automatización, mantenimiento industrial y soluciones de comunicación y tecnologías de la información (TI).`;

  servicios = `Brindamos servicios profesionales en sistemas eléctricos, seguridad electrónica, automatización, mantenimiento industrial y soluciones de comunicación y TI, desarrollando proyectos confiables, escalables y alineados a las necesidades operativas de cada cliente, tanto en Trujillo, La Libertad, como en todo el Perú.`;

  diferencial = `Nuestro crecimiento se sustenta en un equipo técnico altamente certificado, una sólida experiencia en campo y un enfoque preventivo, orientado a garantizar la continuidad del negocio, la seguridad de la información y la máxima confiabilidad operativa de cada proyecto.`;

  compromiso = `Trabajamos bajo altos estándares de calidad, seguridad y eficiencia, consolidándonos como un socio estratégico para empresas que buscan proteger sus activos, optimizar procesos y asegurar la disponibilidad de su infraestructura tecnológica e industrial.`;


  mision = {
    titulo: 'MISIÓN',
    contenido: `Somos una empresa de servicios integrales en infraestructura tecnológica e industrial, comprometida con brindar soluciones innovadoras, confiables y de alta calidad que garanticen la continuidad operativa, la seguridad y el crecimiento sostenible de nuestros clientes.`
  };

  vision = {
    titulo: 'VISIÓN',
    contenido: `Ser reconocidos como el socio estratégico preferido en soluciones de infraestructura tecnológica e industrial en el Perú, distinguiéndonos por nuestra excelencia técnica, innovación constante y compromiso con la satisfacción del cliente.`
  };

  valores = [
    {
      titulo: 'Excelencia',
      descripcion: 'Comprometidos con la máxima calidad en cada proyecto y servicio que brindamos.',
      icon: 'fas fa-star'
    },
    {
      titulo: 'Confiabilidad',
      descripcion: 'Garantizamos soluciones robustas y disponibilidad operativa continua.',
      icon: 'fas fa-shield-alt'
    },
    {
      titulo: 'Innovación',
      descripcion: 'Adoptamos tecnologías modernas y soluciones vanguardistas para nuestros clientes.',
      icon: 'fas fa-lightbulb'
    },
    {
      titulo: 'Integridad',
      descripcion: 'Actuamos con transparencia, ética y responsabilidad en todas nuestras acciones.',
      icon: 'fas fa-handshake'
    },
    {
      titulo: 'Profesionalismo',
      descripcion: 'Equipo técnico certificado con amplia experiencia en el campo.',
      icon: 'fas fa-certificate'
    },
    {
      titulo: 'Compromiso',
      descripcion: 'Dedicados al éxito y crecimiento sostenible de cada cliente.',
      icon: 'fas fa-heart'
    }
  ];


  cambiarTab(tab: 'quienes' | 'mision' | 'valores'): void{
    this.tabActivo = tab;

  }

  nextImagen():void{
    this.currentImageIndex = (this.currentImageIndex + 1) % this.imagenesEquipo.length
  }

  prevImagen():void{
    this.currentImageIndex = (this.currentImageIndex - 1 + this.imagenesEquipo.length) & this.imagenesEquipo.length

  }

  goToImagen(index: number):void{
    this.currentImageIndex = index;
  }

  get imagenActual():ImagenEquipo{
    return this.imagenesEquipo[this.currentImageIndex]
  }

}
