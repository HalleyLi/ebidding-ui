import { bootstrapApplication } from '@angular/platform-browser';
import { MenuFoldOutline, MenuUnfoldOutline, FormOutline, DashboardOutline } from '@ant-design/icons-angular/icons';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NzMessageServiceModule } from 'ng-zorro-antd/message';
import { NzDrawerServiceModule } from 'ng-zorro-antd/drawer';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AppComponent } from './app/app.component';
import { Route, provideRouter, withInMemoryScrolling } from '@angular/router';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { APP_INITIALIZER, enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from '@env/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import interceptors from '@app/core/services/interceptors';
import { ThemeSkinService } from '@app/core/services/theme-skin.service';
import './mock';

const icons = [MenuFoldOutline, MenuUnfoldOutline, DashboardOutline, FormOutline];

const ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: 'login', loadComponent: () => import('./app/pages/login/login.component').then((m) => m.LoginFormComponent) },
  { path: 'default', data: { preload: true }, loadChildren: () => import('./app/layout/default/default-routing') },
  { path: '**', redirectTo: '/login' },
];

const APPINIT_PROVIDES = [
  {
    provide: APP_INITIALIZER,
    useFactory: (themeService: ThemeSkinService) => () => {
      return themeService.loadTheme();
    },
    deps: [ThemeSkinService],
    multi: true
  }
];

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      [...ROUTES],
      withInMemoryScrolling({
        scrollPositionRestoration: 'top'
      }),
      ),
    { provide: NZ_ICONS, useValue: icons },
    importProvidersFrom(NzMessageServiceModule, NzDrawerServiceModule, NzModalModule),
    provideAnimations(),
    ...interceptors,
    ...APPINIT_PROVIDES,
    provideHttpClient(withInterceptorsFromDi())
  ],
}).catch((err) => console.error(err));

