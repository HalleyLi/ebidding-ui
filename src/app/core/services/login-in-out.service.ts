import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { TokenKey, TokenPre } from '@config/constant';
import { Menu } from '@core/services/types';
import { fnFlatDataHasParentToTree } from '@utils/treeTableTools';
import { UserInfo, LoginService } from './login.service';
import { UserInfoService } from './store/userInfo.service';
import { MenuStoreService } from './store/menu-store.service';
import { WindowService } from './window.service';

@Injectable({
  providedIn: 'root'
})
export class LoginInOutService {
  destroyRef = inject(DestroyRef);

  constructor(
    private loginService: LoginService,
    private router: Router,
    private userInfoService: UserInfoService,
    private menuService: MenuStoreService,
    private windowServe: WindowService
  ) {}

  getMenuByRole(role: string): Observable<Menu[]> {
    return this.loginService.getMenuByUserId(role);
  }

  loginIn(user: UserInfo): Promise<void> {
    return new Promise(resolve => {
      this.windowServe.setSessionStorage(TokenKey, TokenPre + user.token);
      this.userInfoService.setUserInfo(user);
      const userInfo: UserInfo = this.userInfoService.parsToken(TokenPre + user.token);
      console.log(`test role: ${userInfo.role}`);
      this.getMenuByRole(user.role)
        .pipe(
          finalize(() => {
            resolve();
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(menus => {
          menus = menus.filter(item => {
            item.selected = false;
            item.open = false;
            return item.menuType === 'C';
          });
          const temp = fnFlatDataHasParentToTree(menus);
          this.menuService.setMenuArrayStore(temp);
          resolve();
        });
    });
  }

  loginOut() {
    this.router.navigate(['/login']);
  }
}
