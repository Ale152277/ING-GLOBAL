import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth.service';

/**
 * Este inicializador se ejecuta ANTES de que Angular renderize cualquier componente
 * Garantiza que el estado de autenticación esté cargado cuando los guards se ejecuten
 * 
 * ⚠️ IMPORTANTE: Ahora retorna una Promise para que Angular espere
 */
@Injectable({
  providedIn: 'root'
})
export class AuthInitializer {
  constructor(private authService: AuthService) {}

  /**
   * Inicializa el estado de autenticación
   * Se llama desde APP_INITIALIZER en app.config.ts
   * 
   * Retorna Promise para que Angular espere a que se cargue
   */
  initializeAuth(): Promise<void> {
    return new Promise((resolve) => {
      console.log('🔄 Inicializando autenticación...');
      
      // Cargar token y usuario desde localStorage
      this.authService.cargarTokenDesdeStorage();
      
      // Verificar si hay un token válido
      const token = this.authService.obtenerToken();
      if (token) {
        console.log('✅ Token encontrado en storage');
        const rol = this.authService.obtenerRolDesdeToken();
        console.log('🔍 Rol:', rol);
        console.log('✅ Autenticación inicializada - Usuario AUTENTICADO');
      } else {
        console.log('❌ No hay token en storage');
        console.log('✅ Autenticación inicializada - Usuario NO autenticado');
      }

      // ⭐ CRÍTICO: Resolver la Promise para que Angular continúe
      // Esto hace que Angular ESPERE antes de ejecutar los guards
      resolve();
    });
  }
}