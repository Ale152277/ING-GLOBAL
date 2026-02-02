import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Guard que protege rutas que requieren autenticación
 * Solo permite acceso si hay un token válido
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('🔐 AuthGuard - Verificando acceso a:', state.url);

     if (!this.isBrowser()) {
      console.log('⚠️ SSR - Permitiendo acceso (verificación en cliente)');
      return true;
    }

    // Verificar si está autenticado
    if (this.authService.isAuthenticated()) {
      console.log('✅ Usuario autenticado');
      return true;
    }

    console.log('❌ Usuario NO autenticado - Redirigiendo a login');
    
    // Redirigir a login con returnUrl
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });

    return false;
  }
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}