import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
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

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('👤 GuestGuard - Verificando acceso a:', state.url);

     if (!this.isBrowser()) {
      console.log('⚠️ SSR - Permitiendo acceso (verificación en cliente)');
      return true;
    }

    // Si está autenticado, redirigir a productos
    if (this.authService.isAuthenticated()) {
      console.log('⚠️ Ya estás autenticado - Redirigiendo a productos');
      this.router.navigate(['/productos']);
      return false;
    }

    console.log('✅ No autenticado - Permitiendo acceso');
    return true;
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}