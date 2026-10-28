import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PerfilService } from '../../services/perfil.service';
import { AuthService } from '../../../../core/services/auth.service';
import { response } from 'express';

@Component({
  selector: 'app-perfil-seguridad',
  imports: [FormsModule],
  templateUrl: './perfil-seguridad.html',
  styleUrl: './perfil-seguridad.css',
})
export class PerfilSeguridad {
  mostrarFormulario = false;
  procesando = false;
  error = '';

  datos = {
    contrasenaActual: '',
    contrasenaNueva: '',
    confirmacion: '',
  };

  mostrar ={
    actual: false,
    nueva: false,
    confirmacion: false
  }

  constructor(
    private perfilService: PerfilService,
    private authService: AuthService,
  ) {}

  alternarFormulario(): void {
    if (this.procesando) return;

    this.mostrarFormulario = !this.mostrarFormulario;
    this.error = '';

    if (!this.mostrarFormulario) {
      this.limpiar();
    }
  }

  cambiarContrasena(form: NgForm): void {
    if (form.invalid || this.procesando) return;

    const { contrasenaActual, contrasenaNueva, confirmacion } = this.datos;
    this.error = '';

    if (contrasenaNueva !== confirmacion) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    if (contrasenaActual === contrasenaNueva) {
      this.error = 'La contraseña debe ser diferente a la actual';
      return;
    }

    this.procesando = true;

    this.perfilService
      .cambiarContrasena({
        contrasenaActual,
        contrasenaNueva,
      })
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.limpiar();
            this.authService.logout();
            return;
          }

          this.error = response.message || 'No se pudo actualizar la contraseña';
          this.procesando = false;
        },
        error: (err) => {
          this.error = err?.error?.message || 'No se pudo actualizar la contraseña';
          this.procesando = false
        },
      });
  }
  private limpiar(): void {
    this.datos = {
      contrasenaActual: '',
      contrasenaNueva: '',
      confirmacion: '',
    };

    this.mostrar={
      actual : false,
      nueva: false,
      confirmacion: false,
    }
  }
}
