import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

/**
 * Guard que protege rutas que requieren rol ADMIN
 * Solo permite acceso si está autenticado Y tiene rol ADMIN
 */
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('👨‍💼 AdminGuard - Verificando acceso a:', state.url);

    if(!this.isBrowser()){
      console.log('SSR - permitiendo acceso (verificacion en cliente)')
      return true;

    }

    // Verificar si está autenticado
    if (!this.authService.isAuthenticated()) {
      console.log('❌ No autenticado - Redirigiendo a login');
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    // Obtener rol desde token
    const rol = this.authService.obtenerRolDesdeToken();
    console.log('🔍 Rol del usuario:', rol);

    // Verificar si es ADMIN
    if (rol === 'ADMIN') {
      console.log('✅ Acceso concedido - Es ADMIN');
      return true;
    }

    console.log('❌ Acceso denegado - No es ADMIN. Redirigiendo a productos');
    this.router.navigate(['/productos']);
    return false;
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}