

import { Menu } from '@core/services/types';


export const CLIENT_MENUS: Menu[] = [
  {
    menuName: 'Dashboard',
    icon: 'appstore',
    open: false,
    id: 1,
    fatherId: 0,
    selected: false,
    menuType: 'C',
    path: '/default/client-portal',
    children: [
      {
        id: 1,
        fatherId: 0,
        menuName: 'BWIC Overview',
        icon: 'form',
        open: false,
        selected: false,
        menuType: 'C',
  
        path: '/default/client-portal/bwic-overview',
      },
      {
        menuName: 'Bidding History',
        icon: 'table',
        open: false,
        selected: false,
        menuType: 'C',
  
        id: 1,
        fatherId: 0,
        path: '/default/client-portal/bidding-history',
      }
    ]
  }
];
export const SALES_MENUS: Menu[] = [
  {
    menuName: 'Dashboard',
    icon: 'appstore',
    open: false,
    id: 1,
    fatherId: 0,
    selected: false,
    menuType: 'C',
    path: '/default/sales-portal',
    children: [
      {
        id: 1,
        fatherId: 0,
        menuName: 'BWIC Admin',
        icon: 'form',
        open: false,
        selected: false,
        menuType: 'C',
  
        path: '/default/sales-portal/bwic-admin',
      },
      {
        menuName: 'BWIC Popular',
        icon: 'table',
        open: false,
        selected: false,
        menuType: 'C',
  
        id: 1,
        fatherId: 0,
        path: '/default/sales-portal/bwic-popular',
      }
    ]
  }
];
