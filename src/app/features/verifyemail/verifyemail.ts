import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

type VerifyState = 'cargando' |'exito' |'error'|'expirado'
@Component({
  selector: 'app-verifyemail',
  imports: [CommonModule, FormsModule],
  templateUrl: './verifyemail.html',
  styleUrl: './verifyemail.css',
})
export class Verifyemail implements OnInit{
  estado: VerifyState = 'cargando';
  mensaje: string = '';
  reenvioEmail : string = '';
  reenvioLoading : boolean = false;
  reenvioMensaje: string = '';
  
  constructor(
    private route : ActivatedRoute,
    private router: Router,
    private AuthService: AuthService
  ){}

  private yaVerificando = false;

  ngOnInit(): void {

    if(this.yaVerificando) return;
    this.yaVerificando = true;
      //leer el token de la URL /verificar-email?token=abc123

      const token = this.route.snapshot.queryParams['token'];

      if(!token){
        this.estado = 'error';
        this.mensaje = 'El enlace de verificacion no es valido o está expirado'
        return;
      }

      const cacheKey = `verificado_${token}`;
      const cached = sessionStorage.getItem(cacheKey);
      if(cached){
        this.estado= 'exito';
        this.mensaje = 'Cuenta verificada, ya puedes iniciar sesion'
      }

      this.AuthService.verificarEmail(token).subscribe({
        next: (response)=>{
          if(response.success){
            this.estado= 'exito';
            this.mensaje = response.message || 'Cuenta verificada con exito, ya puedes loguearte'
          }else{
            //Detectar si está expirado el token
            const esExpirado = response.message?.toLowerCase().includes('expiró')
            this.estado = esExpirado? 'expirado' : 'error';
            this.mensaje = response.message || 'No pudimos verificar tu cuenta'
          }
        },
        error: (error) => {
        const msg = error.error?.message || '';
        const esExpirado = msg.toLowerCase().includes('expiró');
        this.estado = esExpirado ? 'expirado' : 'error';
        this.mensaje = msg || 'Ocurrió un error al verificar tu cuenta.';
      }
    });
  }

  reenviarVerificacion():void{
    if(!this.reenvioEmail){
      this.reenvioMensaje = 'Por favor ingresa tu correo'
      return;
    }

    this.reenvioLoading = true;
    this.reenvioMensaje= '';

    this.AuthService.reenviarVerificacion(this.reenvioEmail).subscribe({
      next: (response)=>{
        this.reenvioMensaje = response.message || 'Correo enviado'
        this.reenvioLoading = false;
      },
      error: () => {
        this.reenvioMensaje = 'No pudimos reenviar el correo. Verifica el email e intenta nuevamente.';
        this.reenvioLoading = false;
      }
    });
  }

  irAlLogin():void{
    this.router.navigate(['/auth/login']);
  }




}
