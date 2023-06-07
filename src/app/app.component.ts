import { AsyncPipe, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AfterViewInit, ChangeDetectionStrategy, Component,DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { PreloaderService } from './core/services/preloader.service';
import { SpinService } from './core/services/store/spin.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { filter } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
  <div >
    <router-outlet #outlet="outlet"></router-outlet>
  </div>
  <div *ngIf="loading$ | async" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:1001;background:rgba(24,144,255,0.1);">
    <div style="position:absolute;top: 50%;left:50%;margin:-16px 0 0 -16px;">
      <nz-spin nzSize="large"></nz-spin>
    </div>
  </div>
`,
  imports: [
    NgIf,
    RouterOutlet,
    FormsModule,
    HttpClientModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzSpinModule,
    AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NZ_I18N, useValue: en_US },
  ],
})
export class AppComponent implements OnInit, AfterViewInit{
  loading$ = this.spinService.getCurrentGlobalSpinStore();
  isCollapsed = false;
  title = 'ebidding-ui';
  destroyRef = inject(DestroyRef);

  constructor(private preloader: PreloaderService, private spinService: SpinService, public router: Router) {}

  ngOnInit(): void {
    this.router.events
    .pipe(
      filter((event: NzSafeAny) => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(() => {
      this.spinService.setCurrentGlobalSpinStore(false);
    });
  }
  ngAfterViewInit(): void {
    this.preloader.removePreLoader();
  }

}
