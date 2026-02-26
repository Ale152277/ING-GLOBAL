import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { ApiResponse } from '../../models/api-response.model';

@Component({
  selector: 'app-consultas',
  imports: [CommonModule, FormsModule],
  templateUrl: './consultas.html',
  styleUrl: './consultas.css',
})
export class Consultas implements OnInit {
  asunto: string = '';
  mensaje: string = '';

  isLoading: boolean = false;
  enviado: boolean = false;
  error: string = '';

  private usuario: any = null;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {

    if(!isPlatformBrowser(this.platformId)) return;
    
    this.usuario = this.authService.obtenerUsuario();
    if (!this.usuario) {
      this.router.navigate(['/auth/login']);
    }
  }

  get nombreUsuario(): string {
    return this.usuario?.nombreCompleto ||'';
  }

  enviarConsulta():void{
    if(!this.asunto.trim() || !this.mensaje.trim() ){
      this.error = 'Por favor completa todos los campos'
    return;
    }
    if(this.mensaje.trim().length<10){
      this.error= 'El mensaje debe tener al menos 10 caracteres'
    return;
    }

    this.isLoading = true;
    this.error =''

    this.http.post<ApiResponse<string>>('http://localhost:8080/api/v1/consultas/enviar',
      {asunto: this.asunto, mensaje: this.mensaje}
    ).subscribe({
      next:(response)=>{
        if(response.success){
          this.enviado = true;
        }else{
          this.error = response.message || 'Error al enviar la consulta';
        }
        this.isLoading = false;
      },
      error:()=>{
        this.error = 'No pudimos enviar tu consulta. Intenta nuevamente';
        this.isLoading = false;
      }
    })

    

  }
  nuevaConsulta():void{
      this.asunto = '';
      this.mensaje = '';
      this.enviado= false;
      this.error ='';
    }
}
