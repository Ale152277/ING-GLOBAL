import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { Usuario } from '../../../../models/usuario.model';
import { AuthService } from '../../../../core/services/auth.service';
import { PerfilService } from '../../services/perfil.service';
import { DatePipe } from '@angular/common';
import { PerfilSeguridad } from '../../components/perfil-seguridad/perfil-seguridad';

@Component({
  selector: 'app-perfil',
  imports: [FormsModule, DatePipe, PerfilSeguridad],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  perfil: Usuario | null = null;

  formulario = {
    nombreCompleto: '',
    telefono: '',
  };

  cargando = false;
  guardando = false;
  error = '';
  mensaje = '';



  constructor(
    private perfilService: PerfilService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.cargando = true;
    this.error = '';

    this.perfilService.obtenerPerfil().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.perfil = response.data;

          this.formulario = {
            nombreCompleto: response.data.nombreCompleto,
            telefono: response.data.telefono ?? '',
          };
        } else {
          this.error = response.message || 'No se pudo cargar el perfil.';
        }

        this.cargando = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'No se pudo cargar el perfil.';
        this.cargando = false;
      },
    });
  }

  guardar(form: NgForm): void {
    if (form.invalid || this.guardando || !this.perfil) return;

    const nombreCompleto = this.formulario.nombreCompleto.trim();

    if (!nombreCompleto) {
      this.error = 'El nombre es obligatorio.';
      return;
    }

    this.guardando = true;
    this.error = '';
    this.mensaje = '';

    this.perfilService
      .actualizarPerfil({
        nombreCompleto,
        telefono: this.formulario.telefono.trim(),
      })
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.perfil = response.data;
            this.authService.actualizarUsuario(response.data);
            this.mensaje = 'Perfil actualizado correctamente.';
          } else {
            this.error = response.message || 'No se pudo actualizar el perfil.';
          }

          this.guardando = false;
        },
        error: (err) => {
          this.error = err?.error?.message || 'No se pudo actualizar el perfil.';
          this.guardando = false;
        },
      });
  }


}
