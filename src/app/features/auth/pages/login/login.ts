import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { response } from 'express';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  error: string = '';
  showPassword: boolean = false;

  cuentaNoVerificada: boolean = false;
  reenvioLoading: boolean = false;
  reenvioMensaje: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  login(): void {
    if (!this.email || !this.password) {
      this.error = 'Por favor, complete todos los campos';
      return;
    }
    this.isLoading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.success) {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/productos';
            this.router.navigateByUrl(returnUrl);
          
        } else {
          this.error = response.message || 'error al iniciar sesión';
          this.cuentaNoVerificada = this.error.toLowerCase().includes('verificar')
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Error al conectar con el servidor';
        this.cuentaNoVerificada = this.error.toLowerCase().includes('verificar');
        this.isLoading = false;
      },
    });
  }

  reenviarVerificacion(): void{
    if(!this.email){
      this.reenvioMensaje = 'Ingresa tu email primero'
      return;

    }
    this.reenvioLoading = true;
    this.reenvioMensaje='';

    this.authService.reenviarVerificacion(this.email).subscribe({
      next:(response)=>{
        this.reenvioMensaje = response.message ||'Correo enviado'
        this.reenvioLoading = false;
      },
      error:()=>{
        this.reenvioMensaje = 'No pudimos reenviar el correo. Intenta en otro momento o contacta con soporte';
        this.reenvioLoading = false;
      }
    })
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  irARegistro(): void {
    this.router.navigate(['/auth/registro']);
  }
}
