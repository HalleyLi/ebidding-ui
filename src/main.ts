import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { Route, provideRouter } from '@angular/router';

const ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: 'login', loadComponent: () => import('./app/pages/login/login.component').then((m) => m.LoginComponent) },
  { path: 'client-portal', loadChildren: () => import('./app/pages/client-portal/client-portal.routing') },
  { path: 'sales-portal', loadChildren: () => import('./app/pages/sales-portal/sales-portal.routing') },
  { path: '**', redirectTo: '/login' },
];

bootstrapApplication(AppComponent, { providers: [provideRouter([...ROUTES])] }).catch((err) => console.error(err));
