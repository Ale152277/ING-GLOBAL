import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

//request = payload que envia el frontend (el contenido debe coincidir)
//response = estructura/wrapper que devuelve el backend como respuesta
//tokenresponse = data real de login
export interface LoginRequest {
  email: string;
  contraseña: string;
}

export interface RegistroRequest {
  nombreCompleto: string;
  email: string;
  contraseña: string;
  telefono: string;
  direccion: string;
}


//devuelve la identidad del usuario
export interface TokenResponse {
  token: string;
  tipo: string;
  expiresIn: number;
  usuario: {
    id: number;
    nombreCompleto: string;
    email: string;
    telefono: string;
    direccion: string;
    rol: string;
    estado: string;
  };
}

//respuesta para cualquier endpoint
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

//este servicio es global y unico, vive mientras exista la app
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';

  //creo un estado reactivo para el token que empieza con lo que haya en el storage
  //crear una variable tokensubject que almacenará un valor inicial (en este casonull)

  private tokenSubject = new BehaviorSubject<string | null>(this.obtenerToken());
  
  //tokens es solo un valor observable que solo servirá para lectura
  public token$ = this.tokenSubject.asObservable();

  private usuarioSubject = new BehaviorSubject<any>(this.obtenerUsuario());
  public usuario$ = this.usuarioSubject.asObservable();

  public isAuthenticated$ = this.tokenSubject.asObservable();

  constructor(
    private http: HttpClient, //cualquier request http al backend, sin esto, auth no podría comunicarse con el backend
    private router: Router, //redirige al usuario a otra ruta
  ) {}

  login(email: string, contraseña: string): Observable<ApiResponse<TokenResponse>> {
    const loginRequest: LoginRequest = { email, contraseña };

    return this.http.post<ApiResponse<TokenResponse>>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.guardarToken(response.data.token);
          this.guardarUsuario(response.data.usuario);
          this.tokenSubject.next(response.data.token);
          this.usuarioSubject.next(response.data.usuario);
        }
      }),
    );
  }

  registro(data:RegistroRequest): Observable<ApiResponse<string>>{
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/registro`, data)
  }


  logout():void{
    this.limpiarLocalStorage();
    this.tokenSubject.next(null);
    this.usuarioSubject.next(null);
    this.router.navigate(['/login']);
  }


  obtenerToken(): string |null{
    if(typeof window !== 'undefined'){
      return sessionStorage.getItem('token')
    }
    return null;
  }

  obtenerUsuario():any{
    if(typeof window !== undefined){
      const usuario = sessionStorage.getItem('usuario');
      return usuario ? JSON.parse(usuario): null;

    }
    return null;
  }

  estaAutenticado(): boolean{
    const token = this.obtenerToken();
    return token != null && token.length > 0;
  }


  private guardarToken(token:string): void{
    if(typeof window !== 'undefined'){
      sessionStorage.setItem('token', token)
    }
  }

  private guardarUsuario(usuario:any):void{
    if(typeof window!=='undefined'){
      sessionStorage.setItem('usuario', JSON.stringify(usuario));
    }
  }


  private limpiarLocalStorage():void{
    if(typeof window !== 'undefined'){
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('usuario')

      
    }
  }



}
