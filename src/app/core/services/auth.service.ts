import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ApiResponse } from '../../models/api-response.model';
import { LoginRequest, RegistroRequest, TokenResponse } from '../../models/auth.model';
import { jwtDecode } from 'jwt-decode';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

//request = payload que envia el frontend (el contenido debe coincidir)
//response = estructura/wrapper que devuelve el backend como respuesta
//tokenresponse = data real de login

//este servicio es global y unico, vive mientras exista la app
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';

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
    console.log('🚀 AuthService inicializado');
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser()) return false;
    const token = localStorage.getItem('token');
    const isAuth = !!token && token.length > 0;    
    console.log('🔍 isAuthenticated() =', isAuth);

    return !!token && token.length > 0;
  }

  cargarTokenDesdeStorage(): void {
if (!this.isBrowser()) {
      console.log('⚠️ No estamos en navegador (SSR)');
      return;
    }
    console.log('📦 Cargando datos desde localStorage...');

    const token = localStorage.getItem('token');
    const usuarioJson = localStorage.getItem('usuario');

    if (token && token.length>0) {
      this.tokenSubject.next(token);
      this.authenticatedSubject.next(true);
      console.log('✅ Token cargado desde storage');
    }

    if (usuarioJson) {
      try {
        const usuario = JSON.parse(usuarioJson);
        this.usuarioSubject.next(usuario);
        console.log('✅ Usuario cargado desde storage');
      } catch (error) {
        console.error('❌ Error al parsear usuario:', error);
      }
    }
  }

  login(email: string, contraseña: string): Observable<ApiResponse<TokenResponse>> {
    const loginRequest: LoginRequest = { email, contraseña };

    return this.http.post<ApiResponse<TokenResponse>>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap((response) => {
        if (response.success && response.data) {
          console.log('✅ Login exitoso');

          // Guardar en localStorage
          this.guardarToken(response.data.token);
          this.guardarUsuario(response.data.usuario);

          // Actualizar BehaviorSubjects
          this.tokenSubject.next(response.data.token);
          this.usuarioSubject.next(response.data.usuario);
          this.authenticatedSubject.next(true);

          console.log('📝 Token guardado:', response.data.token.substring(0, 20) + '...');
          console.log('👤 Usuario guardado:', response.data.usuario.email);
        }
      }),
    );
  }

  registro(data: RegistroRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/registro`, data);
  }

  logout(): void {
    console.log('👋 Ejecutando logout...');
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
      console.log('⚠️ No hay token para decodificar');
      return null;
    }

    try {
      const decoded: any = jwtDecode(token);
      console.log('🔑 Token decodificado:', decoded);
      const rol = decoded.rol || null;
      console.log('👨‍💼 Rol extraído:', rol);
      return rol;
    } catch (error) {
      console.error('❌ Error al decodificar token:', error);
      return null;
    }
  }
  isAdmin():boolean {
    const rol = this.obtenerRolDesdeToken();
    return rol === 'ADMIN';
  }

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

   isLogged(): boolean {
    return !!localStorage.getItem('token');
  }
  
}
