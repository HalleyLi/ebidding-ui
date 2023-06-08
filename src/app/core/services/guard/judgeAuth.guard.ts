import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChildFn } from '@angular/router';
import { Observable } from 'rxjs';

import { MenuStoreService } from '../store/menu-store.service';
import { Menu } from '../types';

// 有兴趣的可以看看class与fn的争议https://github.com/angular/angular/pull/47924
@Injectable({
  providedIn: 'root'
})
export class JudgeAuthGuardService {
  selMenu: Menu | null = null;
  menuNavList: Menu[] = [];
  destroyRef = inject(DestroyRef);

  constructor(
    private menuStoreService: MenuStoreService,
  ) {
    this.menuStoreService
      .getMenuArrayStore()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.menuNavList = res;
      });
  }

  getMenu(menu: Menu[], url: string): void {
    for (let i = 0; i < menu.length; i++) {
      if (url === menu[i].path) {
        this.selMenu = menu[i];
        return;
      } else {
        if (menu[i].children && menu[i].children!.length > 0) {
          this.getMenu(menu[i].children!, url);
        }
      }
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    while (route.firstChild) {
      route = route.firstChild;
    }

    this.getMenu(this.menuNavList, state.url);
    if (!this.selMenu) {
      return true;
    }
    return true;
  }
}

export const JudgeAuthGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(JudgeAuthGuardService).canActivateChild(childRoute, state);
};
