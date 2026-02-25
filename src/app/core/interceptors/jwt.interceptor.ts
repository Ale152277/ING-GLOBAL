import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof window === 'undefined') {
    return next(req);
  }

  const token = localStorage.getItem('token');

  console.log('Interceptando:', req.url);

  if (!token) {
    console.log('TOKEN: NO EXISTE');
    return next(req);
  }

  console.log('🔑 Token: EXISTE');

  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(clonedReq);
};