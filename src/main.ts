import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { Route, provideRouter } from '@angular/router';

const ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

bootstrapApplication(AppComponent, { providers: [provideRouter([...ROUTES])] }).catch((err) => console.error(err));
