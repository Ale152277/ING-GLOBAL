import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.obtenerToken();

  console.log('📨 Interceptando:', req.url);
  console.log('🔑 Token:', token ? 'EXISTE ✅' : 'NO EXISTE ❌');

  if (token) {
    console.log('✅ Agregando Authorization header');
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};