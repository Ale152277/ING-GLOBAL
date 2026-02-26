import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  ) {}

  ngOnInit(): void {
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


  }
}
