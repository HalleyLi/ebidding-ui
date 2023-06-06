import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'bwic-admin', pathMatch: 'full' },
  {
    path: 'bwic-admin',
    data: { title: 'Menu2', key: 'menu2' },
    loadComponent: () => import('./bwic-admin/bwic-admin.component').then((m) => m.BwicAdminComponent),
  },
  {
    path: 'bwic-popular',
    data: { title: 'Menu2', key: 'menu2' },
    loadComponent: () => import('./bwic-popular/bwic-popular.component').then((m) => m.BwicPopularComponent),
  },
] as Route[];
