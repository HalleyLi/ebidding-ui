import { NgIf, NgTemplateOutlet, AsyncPipe, DOCUMENT, NgFor } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit,
  inject,
  DestroyRef,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';

import { IsFirstLogin } from '@config/constant';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { fadeRouteAnimation } from '@app/animations/fade.animation';
import { LayoutHeadRightMenuComponent } from '@app/widget/layout-head-right-menu/layout-head-right-menu.component';
import { ThemeService } from '@app/core/services/store/theme.service';
import { WindowService } from '@app/core/services/window.service';
import { Menu } from '@app/core/services/types';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { MenuStoreService } from '@app/core/services/store/menu-store.service';
import { SplitNavStoreService } from '@app/core/services/store/split-nav-store.service';
import { fnStopMouseEvent } from '@app/utils/tools';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { TrackByPropertyDirective } from '@app/shared/track-by-property.directive';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeRouteAnimation],
  standalone: true,
  imports: [
    NgIf,
    NgTemplateOutlet,
    ToolBarComponent,
    NzIconModule,
    NzButtonModule,
    LayoutHeadRightMenuComponent,
    ToolBarComponent,
    RouterOutlet,
    AsyncPipe,
    NzMenuModule,
    NgTemplateOutlet,
    NgFor,
    TrackByPropertyDirective,
    NzButtonModule,
    NzIconModule,
    RouterLink,
    AsyncPipe,
    NzLayoutModule,
  ],
})
export class DefaultComponent implements OnInit, AfterViewInit {
  isCollapsed$ = this.themesService.getIsCollapsed();
  themeOptions$ = this.themesService.getThemesMode();
  isCollapsed = false;
  destroyRef = inject(DestroyRef);
  themesOptions$ = this.themesService.getThemesMode();
  isNightTheme$ = this.themesService.getIsNightTheme();

  routerPath = this.router.url;
  isOverMode = false;
  isMixiMode = false;
  leftMenuArray: Menu[] = [];
  menus: Menu[] = [];
  copyMenus: Menu[] = [];

  constructor(
    private windowService: WindowService,
    private router: Router,
    private menuServices: MenuStoreService,
    private splitNavStoreService: SplitNavStoreService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private themesService: ThemeService,
    private titleServe: Title,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.initMenus();

    this.subIsCollapsed();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        tap(() => {
          // @ts-ignore
          this.routerPath = this.activatedRoute.snapshot['_routerState'].url;
          // 做一个copyMenus来记录当前menu状态，因为顶部模式时是不展示子menu的，然而主题由顶部模式切换成侧边栏模式，要把当前顶部模式中菜单的状态体现于侧边栏模式的菜单中
          this.clickMenuItem(this.menus);
          this.clickMenuItem(this.copyMenus);
          // 是折叠的菜单并且不是over菜单,解决折叠左侧菜单时，切换tab会有悬浮框菜单的bug
          if (this.isCollapsed && !this.isOverMode) {
            this.closeMenuOpen(this.menus);
          }
        }),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => {
          return route.outlet === 'primary';
        }),
        mergeMap((route) => {
          return route.data;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((routeData) => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }

        this.titleServe.setTitle(`${routeData['title']} - Ebidding UI`);
      });
  }

  changeCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
    // TODO： remove
    this.themesService.setIsCollapsed(this.isCollapsed);
  }

  subTheme(): void {
    this.themesService
      .getIsCollapsed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => (this.isCollapsed = res));
  }

  prepareRoute(outlet: RouterOutlet): string {
    return outlet?.activatedRouteData?.['key'];
  }

  ngAfterViewInit(): void {
    if (this.windowService.getStorage(IsFirstLogin) === 'false') {
      return;
    }
    this.windowService.setStorage(IsFirstLogin, 'false');
  }

  initMenus(): void {
    this.menuServices
      .getMenuArrayStore()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((menusArray) => {
        this.menus = menusArray;
        this.copyMenus = this.cloneMenuArray(this.menus);
        this.clickMenuItem(this.menus);
        this.clickMenuItem(this.copyMenus);
        this.cdr.markForCheck();
      });
  }

  cloneMenuArray(sourceMenuArray: Menu[], target: Menu[] = []): Menu[] {
    sourceMenuArray.forEach((item) => {
      const obj: Menu = { menuName: '', menuType: 'C', path: '', id: -1, fatherId: -1 };
      for (let i in item) {
        if (item.hasOwnProperty(i)) {
          // @ts-ignore
          if (Array.isArray(item[i])) {
            // @ts-ignore
            obj[i] = this.cloneMenuArray(item[i]);
          } else {
            // @ts-ignore
            obj[i] = item[i];
          }
        }
      }
      target.push({ ...obj });
    });
    return target;
  }

  flatMenu(menus: Menu[], routePath: string): void {
    menus.forEach((item) => {
      item.selected = false;
      item.open = false;
      if (routePath.includes(item.path) && !item.newLinkFlag) {
        item.selected = true;
        item.open = true;
      }
      if (!!item.children && item.children.length > 0) {
        this.flatMenu(item.children, routePath);
      }
    });
  }

  clickMenuItem(menus: Menu[]): void {
    if (!menus) {
      return;
    }
    const index = this.routerPath.indexOf('?') === -1 ? this.routerPath.length : this.routerPath.indexOf('?');
    const routePath = this.routerPath.substring(0, index);
    this.flatMenu(menus, routePath);
    this.cdr.markForCheck();
  }

  // 改变当前菜单展示状态
  changeOpen(currentMenu: Menu, allMenu: Menu[]): void {
    allMenu.forEach((item) => {
      item.open = false;
    });
    currentMenu.open = true;
  }

  closeMenuOpen(menus: Menu[]): void {
    menus.forEach((menu) => {
      menu.open = false;
      if (menu.children && menu.children.length > 0) {
        this.closeMenuOpen(menu.children);
      } else {
        return;
      }
    });
  }

  changeRoute(e: MouseEvent, menu: Menu): void {
    if (menu.newLinkFlag) {
      fnStopMouseEvent(e);
      window.open(menu.path, '_blank');
      return;
    }
    this.router.navigate([menu.path]);
  }

  subIsCollapsed(): void {
    this.isCollapsed$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((isCollapsed) => {
      this.isCollapsed = isCollapsed;
      if (!this.isCollapsed) {
        this.menus = this.cloneMenuArray(this.copyMenus);
        this.clickMenuItem(this.menus);
      } else {
        this.copyMenus = this.cloneMenuArray(this.menus);
        this.closeMenuOpen(this.menus);
      }
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    this.subTheme();
  }
}
