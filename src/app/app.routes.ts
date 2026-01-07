// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/Auth/auth-guard';
import { guestGuard } from './core/guards/Guest/guest-guard';

export const routes: Routes = [
  // ============================================================
  // HOME - Página principal (sin protección)
  // ============================================================
  {
    path: '',
    loadChildren: () => import('./features/home/home-module').then(m => m.HomeModule),
  },

  // ============================================================
  // AUTENTICACIÓN - Login y Registro
  // ============================================================
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule),
  },

  // ============================================================
  // PRODUCTOS - Listado y detalles de productos
  // ============================================================
  {
    path: 'productos',
    loadChildren: () => import('./features/productos/productos-module').then(m => m.ProductosModule)
    // Sin canActivate: accesible para todos
  },

  // ============================================================
  // CARRITO - Carrito de compras
  // ============================================================
  {
    path: 'carrito',
    loadChildren: () => import('./features/carrito/carrito-module').then(m => m.CarritoModule),
  },

  // ============================================================
  // PEDIDOS - Mis pedidos y tracking
  // ============================================================
  {
    path: 'pedidos',
    loadChildren: () => import('./features/pedidos/pedidos-module').then(m => m.PedidosModule),
  },

  // ============================================================
  // CUENTA - Perfil, direcciones, lista de deseos
  // ============================================================
  {
    path: 'cuenta',
    loadChildren: () => import('./features/cuenta/cuenta-module').then(m => m.CuentaModule),
  },

  // ============================================================
  // ADMIN - Panel de administración
  // ============================================================
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule),
  },

  // ============================================================
  // RUTA WILDCARD - Redirige a home si no existe
  // ============================================================
  {
    path: '**',
    redirectTo: ''
  }
];