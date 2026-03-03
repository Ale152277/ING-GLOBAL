import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { Navbar } from './shared/components/navbar/navbar';
import { CommonModule } from '@angular/common';

const rutas_sin_header_footer_navbar = ['/auth/login', '/auth/registro']
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('IngGlobal-frontend');

  //visibilidad de contenido
  protected mostrarHeader = signal<boolean>(true);
  protected mostrarfooter = signal<boolean>(true);
  protected mostrarnavbar = signal<boolean>(true)

  constructor(private router: Router) {}

  ngOnInit(): void {
      //un solo lugar para manejar los cambios de ruta
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd)=>{
        const url = event.urlAfterRedirects.split('?')[0]; //ignorar query params
        const esRutaAuth = rutas_sin_header_footer_navbar.includes(url);
        this.mostrarfooter.set(!esRutaAuth);
        this.mostrarnavbar.set(!esRutaAuth);
      });

      //verificar la ruta iniciañ (por si se carga directo en /auth/login)
      const urlInicial = this.router.url.split('?')[0];
      const esRutaAuthInicial = rutas_sin_header_footer_navbar.includes(urlInicial)
      this.mostrarHeader.set(!esRutaAuthInicial);
      this.mostrarfooter.set(!esRutaAuthInicial);
      this.mostrarnavbar.set(!esRutaAuthInicial);

    
  }
  



}



