import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { AuthInitializer } from './core/services/auth-initializer';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
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
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([jwtInterceptor])
    ),
    
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthInitializer],
      multi: true
    }
  ]
};