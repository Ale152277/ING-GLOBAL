import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Guard que protege rutas que solo deben ser accesibles si NO estás autenticado
 * Ejemplo: Login y Registro
 * Si intentas ir a login estando logueado, te redirige a productos
 */
@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): boolean {

     if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    // Si está autenticado, redirigir a productos
  
    if(this.authService.isAuthenticatedSync()){
      this.router.navigate(['/productos'])
      return false//bloquea acceso a login y registro
    }

    return true; //permite acceso si no está autenticado
  }

}