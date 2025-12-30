import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { AuthResolver } from './core/auth/auth.resolver';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./features/admin/admin.routes').then((c) => c.routes)
      }
    ],
    resolve: {data: AuthResolver},
  },
  {
    path: 'auth',
    children: [
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then(r => r.routes)
      }
    ],
    canActivate: [AuthGuard],
  },
];
