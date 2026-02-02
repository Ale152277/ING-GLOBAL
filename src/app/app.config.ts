import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { AuthInitializer } from './core/guards/Auth/auth-initializer';
// ✅ NUEVA FUNCIÓN
export function initializeAuth(authInitializer: AuthInitializer): () => void {
  return () => {
    authInitializer.initializeAuth();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptors([jwtInterceptor])
    ),
    // ✅ NUEVO PROVIDER
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthInitializer],
      multi: true
    }
  ]
};