import { Route } from '@angular/router';


import { DefaultComponent } from './default.component';
import { JudgeLoginGuard } from '@app/core/services/guard/judgeLogin.guard';
import { JudgeAuthGuard } from '@app/core/services/guard/judgeAuth.guard';

export default [
  {
    path: '',
    component: DefaultComponent,
    canActivateChild: [JudgeLoginGuard, JudgeAuthGuard],
    children: [
      { path: '', redirectTo: 'client-portal', pathMatch: 'full' },
      { path: 'client-portal', loadChildren: () => import('../../pages/client-portal/client-portal.routing') },
      { path: 'sales-portal', loadChildren: () => import('../../pages/sales-portal/sales-portal.routing') },
    ],
  },
] as Route[];
