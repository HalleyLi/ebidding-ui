import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import { MenuFoldOutline, MenuUnfoldOutline, FormOutline, DashboardOutline } from '@ant-design/icons-angular/icons';
import en from '@angular/common/locales/es-US';
import zh from '@angular/common/locales/zh';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NzMessageServiceModule } from 'ng-zorro-antd/message';
import { NzDrawerServiceModule } from 'ng-zorro-antd/drawer';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AppComponent } from './app/app.component';
import { Route, provideRouter, withInMemoryScrolling } from '@angular/router';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NZ_I18N, en_US, zh_CN } from 'ng-zorro-antd/i18n';
import { APP_INITIALIZER, LOCALE_ID, enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from '@env/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import interceptors from '@app/core/services/interceptors';
import { ThemeSkinService } from '@app/core/services/theme-skin.service';
import { InitThemeService } from '@app/core/services/init-theme.service';
// import './mock';

registerLocaleData(en, 'en-US');
registerLocaleData(zh);

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

export function InitThemeServiceFactory(initThemeService: InitThemeService) {
  return async () => await initThemeService.initTheme();
}

const APPINIT_PROVIDES = [
  {
    provide: APP_INITIALIZER,
    useFactory: InitThemeServiceFactory,
    deps: [InitThemeService],
    multi: true,
  },
  {
    provide: APP_INITIALIZER,
    useFactory: (themeService: ThemeSkinService) => () => {
      return themeService.loadTheme();
    },
    deps: [ThemeSkinService],
    multi: true,
  },
];

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      [...ROUTES],
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      })
    ),
    {
      provide: NZ_I18N,
      useFactory: (localId: string) => {
        switch (localId) {
          case 'en':
            return en_US;
          case 'zh':
            return zh_CN;
          default:
            return en_US;
        }
      },
      deps: [LOCALE_ID]
    },
    { provide: NZ_ICONS, useValue: icons },
    importProvidersFrom(NzMessageServiceModule, NzDrawerServiceModule, NzModalModule),
    provideAnimations(),
    ...interceptors,
    ...APPINIT_PROVIDES,
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.error(err));
