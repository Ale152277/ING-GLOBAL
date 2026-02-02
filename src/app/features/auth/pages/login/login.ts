import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
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
          console.log('✅ Login exitoso');
          console.log('📦 Response:', response.data);

          // ✅ Esperar a que se guarden los datos en localStorage
         
            console.log('🔍 Verificando localStorage después de guardar:');
            console.log('Token:', localStorage.getItem('token') ? 'SÍ' : 'NO');
            console.log('Usuario:', localStorage.getItem('usuario') ? 'SÍ' : 'NO');

            // Navegar después de verificar
            console.log('ROL:', this.authService.obtenerRolDesdeToken());

            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/productos';

            this.router.navigateByUrl(returnUrl);
          
        } else {
          this.error = response.message || 'error al iniciar sesión';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error en el login', error);
        this.error = error.error?.message || 'Error al conectar con el servidor';
        this.isLoading = false;
      },
    });
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  irARegistro(): void {
    this.router.navigate(['/auth/registro']);
  }
}
