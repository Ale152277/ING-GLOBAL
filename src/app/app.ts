import { Component, signal } from '@angular/core';
import { RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { CommonModule } from '@angular/common';
import { Navbar } from './shared/components/navbar/navbar';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('IngGlobal-frontend');
  protected currentroute = signal<string>('');

  //visibilidad de contenido
  protected mostrarnavbar = signal<boolean>(true);
  protected mostrarfooter = signal<boolean>(true);

  constructor(private router: Router) {
    this.detectarCambiosRuta();
    this.actualizarVisibilidad();
    
  }

  //detectar cambios de ruta
  private detectarCambiosRuta(): void{
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentroute.set(event.urlAfterRedirects);
      

  },);}


  /** */
  private actualizarVisibilidad():void{
    const url = this.router.url.split('?')[0];

    const rutasSinNavbar = ['auth/login', 'auth/register'];

    const rutasSinFooter = ['auth/login', 'auth/register'];

    this.mostrarnavbar.set(!rutasSinNavbar.includes(url));
    this.mostrarfooter.set(!rutasSinFooter.includes(url));
  }

}



