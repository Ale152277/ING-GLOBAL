import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/pages/home/home';
import { Productos } from './features/productos/pages/productos/productos';
import { Nosotros } from './features/home/pages/nosotros/nosotros';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { AuthGuard } from './core/guards/Auth/auth-guard';
import { GuestGuard } from './core/guards/Guest/guest-guard';
import { Perfil } from './features/cuenta/pages/perfil/perfil';
import { InterfazCarrito } from './features/carrito/pages/interfaz-carrito/interfaz-carrito';
import { ProductosAdmin } from './features/productos-admin/productos-admin';
import { AdminGuard } from './core/guards/Admin/admin-guard';
import { Verifyemail } from './features/auth/pages/verifyemail/verifyemail';
import { Consultas } from './features/consultas/pages/consultas/consultas';
import { MisPedidos } from './features/ventas/pages/mis-pedidos/mis-pedidos';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { AdminDashboard } from './features/admin/dashboard/pages/admin-dashboard/admin-dashboard';
import { AdminOrders } from './features/admin/orders/admin-orders/admin-orders';
import { PagoPedido } from './features/pagos/pages/pago-pedido/pago-pedido';
import { RevisionPagos } from './features/admin/payments/pages/revision-pagos/revision-pagos';
import { MisDirecciones } from './features/cuenta/pages/mis-direcciones/mis-direcciones';

export const routes: Routes = [
  // auth
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: Login,
        canActivate: [GuestGuard],
      },
      {
        path: 'registro',
        component: Register,
        canActivate: [GuestGuard],
      },
    ],
  },

  // admin
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        component: AdminDashboard,
      },
      {
        path: 'productos',
        component: ProductosAdmin,
      },
      {
        path: 'pedidos',
        component: AdminOrders,
      },
      {
        path: 'pagos',
        component: RevisionPagos,
      },
    ],
  },

  // tienda-clente
  {
    path: '',
    component: PublicLayout,

    children: [
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
        path: 'consultas',
        component: Consultas,
      },

      {
        path: 'verificar-email',
        component: Verifyemail,
      },

      {
        path: 'cuenta',
        component: Perfil,
        canActivate: [AuthGuard],
      },

      {
        path: 'carrito',
        component: InterfazCarrito,
        canActivate: [AuthGuard],
      },

      {
        path: 'pedidos',
        component: MisPedidos,
        canActivate: [AuthGuard],
      },

      {
        path: 'pago/:ventaId',
        component: PagoPedido,
        canActivate: [AuthGuard],
      },
      {
        path: 'cuenta/direcciones',
        component: MisDirecciones,
        canActivate: [AuthGuard],
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
