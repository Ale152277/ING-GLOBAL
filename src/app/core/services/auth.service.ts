import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ApiResponse } from '../../models/api-response.model';
import { LoginRequest, RegistroRequest, TokenResponse } from '../../models/auth.model';
import { jwtDecode } from 'jwt-decode';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
//request = payload que envia el frontend (el contenido debe coincidir)
//response = estructura/wrapper que devuelve el backend como respuesta
//tokenresponse = data real de login

//este servicio es global y unico, vive mientras exista la app
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/v1/auth`;

  //creo un estado reactivo para el token que empieza con lo que haya en el storage
  //crear una variable tokensubject que almacenará un valor inicial (en este casonull)

  private tokenSubject = new BehaviorSubject<string | null>(null);
  private usuarioSubject = new BehaviorSubject<any>(null);
  private authenticatedSubject = new BehaviorSubject<boolean>(false);

  public token$ = this.tokenSubject.asObservable();
  public usuario$ = this.usuarioSubject.asObservable();
  public authenticated$ = this.authenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const usuarioJson = localStorage.getItem('usuario');

      // Actualizar subjects inmediatamente con los datos del storage
      // Así token$ emite el valor correcto desde el primer render en cliente
      if (token && token.length > 0) {
        this.tokenSubject.next(token);
        this.authenticatedSubject.next(true);
      }

      if (usuarioJson) {
        try {
          this.usuarioSubject.next(JSON.parse(usuarioJson));
        } catch {}
      }
    }
    
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser()) return false;
    const token = localStorage.getItem('token');
    return !!token && token.length > 0;
  }

  cargarTokenDesdeStorage(): void {
    if (!this.isBrowser()) return;

    const token = localStorage.getItem('token');
    const usuarioJson = localStorage.getItem('usuario');

    if (token && token.length > 0) {
      this.tokenSubject.next(token);
      this.authenticatedSubject.next(true);
    }

    if (usuarioJson) {
      try {
        const usuario = JSON.parse(usuarioJson);
        this.usuarioSubject.next(usuario);
      } catch (error) {
        console.error('Error al parsear usuario:', error);
      }
    }
  }

  login(email: string, contraseña: string): Observable<ApiResponse<TokenResponse>> {
    const loginRequest: LoginRequest = { email, contraseña };

    return this.http.post<ApiResponse<TokenResponse>>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap((response) => {
        if (response.success && response.data) {
          // Guardar en localStorage
          this.guardarToken(response.data.token);
          this.guardarUsuario(response.data.usuario);
          // Actualizar BehaviorSubjects
          this.tokenSubject.next(response.data.token);
          this.usuarioSubject.next(response.data.usuario);
          this.authenticatedSubject.next(true);
        }
      }),
    );
  }

  registro(data: RegistroRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/registro`, data);
  }

  logout(): void {
    this.limpiarLocalStorage();
    this.tokenSubject.next(null);
    this.usuarioSubject.next(null);
    this.authenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  obtenerToken(): string | null {
    if (!this.isBrowser()) return null;
    const token = localStorage.getItem('token');
    return token && token.length > 0 ? token : null;
  }

  obtenerUsuario(): any {
    if (!this.isBrowser()) return null;
    const usuarioJson = localStorage.getItem('usuario');
    return usuarioJson ? JSON.parse(usuarioJson) : null;
  }
  obtenerRolDesdeToken(): string | null {
    const token = this.obtenerToken();

    if (!token) {
      return null;
    }

    try {
      const decoded: any = jwtDecode(token);
      return decoded.rol || null;
    } catch (error) {
      return null;
    }
  }
  isAdmin(): boolean {
    const rol = this.obtenerRolDesdeToken();
    return rol === 'ADMIN';
  }
  
  isLogged(): boolean {
    return !!localStorage.getItem('token');
  }

  verificarEmail(token: string): Observable<ApiResponse<string>>{
    return this.http.get<ApiResponse<string>>(`${this.apiUrl}/verificar`,{params:{token}})
  }

  reenviarVerificacion(email:string): Observable<ApiResponse<string>>{
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/reenviar-verificacion`, null, {params:{email}})
  }

  



  /* METODOS PRIVADOS */

  private guardarToken(token: string): void {
    if (!this.isBrowser()) return;

    localStorage.setItem('token', token);
  }

  private guardarUsuario(usuario: any): void {
    if (!this.isBrowser()) return;

    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  private limpiarLocalStorage(): void {
    if (!this.isBrowser()) return;
    {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  isAuthenticatedSync():boolean{
    return this.authenticatedSubject.getValue();
  }

 


}
