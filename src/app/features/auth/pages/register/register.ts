import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { response } from 'express';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  nombreCompleto: string = '';
  email: string = '';
  password: string = '';
  passwordconfirm: string = '';
  telefono: string = '';
  direccion: string = '';

  isLoading: boolean = false;
  error: string = '';
  success: string = '';
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  registro(): void {
    if (
      !this.nombreCompleto ||
      !this.email ||
      !this.password ||
      !this.telefono ||
      !this.direccion
    ) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    if (this.password !== this.passwordconfirm) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracterers';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.success = '';

    const registroData = {
      nombreCompleto: this.nombreCompleto,
      email: this.email,
      contraseña: this.password,
      telefono: this.telefono,
      direccion: this.direccion,
    };

    this.authService.registro(registroData).subscribe({
      next: (response)=>{
        if(response.success){
          this.success = 'Registro exitoso, redirigiendo al login'
          setTimeout(()=>{
            this.router.navigate(['/home'])
          }, 2000);
        }else{
          this.error = response.message || 'Error al registrarse';
        }
        this.isLoading = false
      },
      error: (error)=>{
        console.error('error en el registro:', error)
        this.error = error.error?.message || 'El email ya está registrado o error del servidor'
        this.isLoading = false;
      }
    })
  }
  togglePasswordVisibility():void{
    this.showPassword = !this.showPassword;
  }

  irAlLogin():void{
    this.router.navigate(['/auth/login'])
  }
}
