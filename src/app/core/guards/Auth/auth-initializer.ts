import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth.service';
/**
 * Este inicializador se ejecuta ANTES de que Angular renderize cualquier componente
 * Garantiza que el estado de autenticación esté cargado cuando los guards se ejecuten
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class AuthInitializer {
  constructor(private authService: AuthService) {}

  /**
   * Inicializa el estado de autenticación
   * Se llama desde APP_INITIALIZER en app.config.ts
   */
  initializeAuth(): Promise<void> {
    return new Promise((resolve) => {
      // Cargar token y usuario desde localStorage
      this.authService.cargarTokenDesdeStorage();

      resolve();
    });
  }
}