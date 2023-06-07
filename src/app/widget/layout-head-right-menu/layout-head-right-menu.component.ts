import { NgTemplateOutlet, NgIf } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LoginInOutService } from '@app/core/services/login-in-out.service';
import { WindowService } from '@app/core/services/window.service';

import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
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
    NzMenuModule
  ]
})
export class LayoutHeadRightMenuComponent implements OnInit {
  constructor(
    private loginOutService: LoginInOutService,
    private windowServe: WindowService,
    public message: NzMessageService,
  ) {}


  clean(): void {
    this.windowServe.clearStorage();
    this.windowServe.clearSessionStorage();
    this.loginOutService.loginOut();
    this.message.success('clear cache successfully, please login again');
  }

  showMessage(): void {
    this.message.info('switch successfully');
  }

  goLogin(): void {
    this.loginOutService.loginOut();
  }

  ngOnInit(): void {}
}
