import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { Productos } from './features/productos/pages/productos/productos';
import { Nosotros } from './features/nosotros/nosotros/nosotros';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { AuthGuard } from './core/guards/Auth/auth-guard';
import { GuestGuard } from './core/guards/Guest/guest-guard';
import { Perfil } from './features/cuenta/pages/perfil/perfil';
import { InterfazCarrito } from './features/carrito/pages/interfaz-carrito/interfaz-carrito';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },

  {
    path: 'productos',
    component: Productos,
  },

  {
    path: 'nosotros',
    component: Nosotros,
  },

  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: Login,
        canActivate: [GuestGuard]  // Solo si NO estás logueado
      },
      {
        path: 'registro',
        component: Register,
        canActivate: [GuestGuard]  // Solo si NO estás logueado
      }
    ]
  },

  {
    path: 'cuenta',
    component: Perfil,
    canActivate: [AuthGuard]  // Solo si ESTÁS logueado
    // Componentes: perfil, direcciones, etc
  },

  {
    path: 'carrito',
    component: InterfazCarrito,
    canActivate: [AuthGuard]  // Solo si ESTÁS logueado
  },

  {
    path: '**',
    redirectTo: '',
  },
];
