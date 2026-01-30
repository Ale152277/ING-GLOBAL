import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): boolean {
    
    // Si el usuario YA está autenticado, redirigir a productos
    if (this.authService.estaAutenticado()) {
      this.router.navigate(['/productos']);
      return false;
    }

    // Si NO está autenticado, permitir acceso a login/registro
    return true;
  }
}