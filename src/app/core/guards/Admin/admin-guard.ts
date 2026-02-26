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

    if(!isPlatformBrowser(this.platformId)){
      return true;

    }

    // Verificar si está autenticado
    if (!this.authService.isAuthenticatedSync()) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    if(this.authService.isAdmin()){
      return true;
    }

    this.router.navigate(['/productos']);
    return false;
  }

}