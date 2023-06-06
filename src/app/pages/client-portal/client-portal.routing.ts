import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'bwic-overview', pathMatch: 'full' },
  {
    path: 'bwic-overview',
    loadComponent: () => import('./bwic-overview/bwic-overview.component').then((m) => m.BwicOverviewComponent),
  },
  {
    path: 'bidding-history',
    loadComponent: () => import('./bidding-history/bidding-history.component').then((m) => m.BiddingHistoryComponent),
  },
] as Route[];
