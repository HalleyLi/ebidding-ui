import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ActionCode } from '@config/actionCode';
import { TokenKey, TokenPre } from '@config/constant';
import { Menu } from '@core/services/types';
import { fnFlatDataHasParentToTree } from '@utils/treeTableTools';
import { Account, LoginService } from './login.service';
import { UserInfoService, UserInfo } from './store/userInfo.service';
import { MenuStoreService } from './store/menu-store.service';
import { WindowService } from './window.service';

/*
 * 退出登录
 * */
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

  getMenuByUserId(userId: number): Observable<Menu[]> {
    return this.loginService.getMenuByUserId(userId);
  }

  loginIn(user: Account): Promise<void> {
    return new Promise(resolve => {
      this.windowServe.setSessionStorage(TokenKey, TokenPre + user.token);
      const userInfo: UserInfo = this.userInfoService.parsToken(TokenPre + user);
      //TODO remove it
      userInfo.authCode.push(ActionCode.TabsDetail);
      userInfo.authCode.push(ActionCode.SearchTableDetail);
      this.userInfoService.setUserInfo(userInfo);
      this.getMenuByUserId(userInfo.userId)
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
