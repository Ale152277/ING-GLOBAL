import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
// import { AuthComponent } from './features/auth/auth';
// import { ProductosComponent } from './features/productos/productos';
// import { CarritoComponent } from './features/carrito/carrito';
// import { PedidosComponent } from './features/pedidos/pedidos';
// import { CuentaComponent } from './features/cuenta/cuenta';
// import { AdminComponent } from './features/admin/admin';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  
  // {
  //   path: 'auth',
  //   component: AuthComponent
  // },
  
  // {
  //   path: 'productos',
  //   component: ProductosComponent
  // },
  
  // {
  //   path: 'carrito',
  //   component: CarritoComponent
  // },
  
  // {
  //   path: 'pedidos',
  //   component: PedidosComponent
  // },
  
  // {
  //   path: 'cuenta',
  //   component: CuentaComponent
  // },
  
  // {
  //   path: 'admin',
  //   component: AdminComponent
  // },

  {
    path: '**',
    redirectTo: ''
  }
];