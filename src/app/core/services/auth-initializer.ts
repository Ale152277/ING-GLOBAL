import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInitializer {
  constructor(private authService: AuthService) {}


  initializeAuth(): Promise<void> {
    return new Promise((resolve) => {
      this.authService.cargarTokenDesdeStorage();

      resolve();
    });
  }
}