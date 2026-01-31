import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.obtenerToken();

  console.log('Interceptando:', req.url);

  if(!token){
    console.log('TOKEN: NO EXISTE');
    return next(req);
  }
    console.log('🔑 Token: EXISTE ✅ -', token.substring(0, 20) + '...');

  const clonedRequ = req.clone({
    setHeaders:{
      Authorization: `Bearer ${token}`
    }
  });

  console.log('Authorization header agregado')
  return next(clonedRequ);
};