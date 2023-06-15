import { NgTemplateOutlet, NgIf } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoginInOutService } from '@app/core/services/login-in-out.service';
import { UserInfo } from '@app/core/services/login.service';
import { UserInfoService } from '@app/core/services/store/userInfo.service';
import { WindowService } from '@app/core/services/window.service';

import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzI18nService, zh_CN, en_US } from 'ng-zorro-antd/i18n';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-layout-head-right-menu',
  templateUrl: './layout-head-right-menu.component.html',
  styleUrls: ['./layout-head-right-menu.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NzToolTipModule,
    NzIconModule,
    NzButtonModule,
    NgIf,
    NzDropDownModule,
    NzBadgeModule,
    NzMenuModule,
  ],
})
export class LayoutHeadRightMenuComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  user!: UserInfo;

  constructor(
    private loginOutService: LoginInOutService,
    private windowServe: WindowService,
    private userInfoService: UserInfoService,
    public message: NzMessageService,
    private i18n: NzI18nService
  ) {}

  clean(): void {
    this.windowServe.clearStorage();
    this.windowServe.clearSessionStorage();
    this.loginOutService.loginOut();
    this.message.success('Clear cache successfully, please login again!');
  }

  showMessage(locale: 'en' | 'zh'): void {
    this.i18n.setLocale(locale === 'en' ? en_US : zh_CN);
    this.message.info('Switch successfully');
  }

  goLogin(): void {
    this.loginOutService.loginOut();
  }

  ngOnInit(): void {
    this.userInfoService
      .getUserInfo()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.user = {
          name: user.name,
          role: user.role,
        };
      });
  }
}
