import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
@Component({
  selector: 'app-admin-topbar',
  imports: [],
  templateUrl: './admin-topbar.html',
  styleUrl: './admin-topbar.css',
})
export class AdminTopbar {

  identificadorUsuario = 'Administrador'

  constructor(
    private authService: AuthService,
  ){
    const usuario = this.authService.obtenerUsuario();
    

    if(usuario?.nombreCompleto){
      this.identificadorUsuario = usuario.email;
    }
  }

   cerrarSesion(): void {
    this.authService.logout();
  }
}
