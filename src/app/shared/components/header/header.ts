import { Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { Token } from '@angular/compiler';
@Component({
  selector: 'app-header',
  imports: [ CommonModule, RouterModule, RouterLink ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy {
  cantidadCarrito =0;
  cantidadDeseos= 0;
  usuarioAutenticado = false;
  nombreUsuario = 'Guest';
  menuAbierto = false;
  perfilAbierto = false;

  private destroy$ = new Subject<void>()

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarDatos();

    this.authService.token$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((token)=>{
      this.usuarioAutenticado = !!token
      if(token){
        const usuario = this.authService.obtenerUsuario();
        this.nombreUsuario = usuario?.nombreCompleto || 'Usuario'

      }else{
        this.nombreUsuario = 'Guest';
      }
    })
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  private cargarDatos(): void {
    this.usuarioAutenticado = this.authService.isAuthenticated();
    if(this.usuarioAutenticado){
      const usuario = this.authService.obtenerUsuario()
      this.nombreUsuario = usuario?.nombreCompleto || 'Usuario'
    }
    this.cantidadCarrito =  0;
    this.cantidadDeseos = 0;


  }

  logout():void{
    this.authService.logout();
    this.nombreUsuario = 'Guest';
    this.router.navigate(['/auth/login']);
  }


  irAlCarrito():void{
    if(!this.usuarioAutenticado){
      this.router.navigate(['/home'])
    }
  }

  irADeseos():void{
    if(!this.usuarioAutenticado){
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/cuenta/lista-deseos'])
  }
  agregaraCarrito():void{
    if(!this.usuarioAutenticado){
      this.router.navigate(['/login'])
      return
    }
    this.cantidadCarrito++;
  }

  togglePerfil():void{
    this.perfilAbierto = !this.perfilAbierto;
  }

  cerrarPerfil():void{
    this.perfilAbierto = false;
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

 
  cerrarMenu(): void {
    this.menuAbierto = false;
  }


  abrirWhatsapp(): void {
  const urlWhatsapp = `https://wa.me/51973306855`;
  window.open(urlWhatsapp, '_blank'); // Abre en nueva pestaña
}

}
