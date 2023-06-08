import { CdkDrag } from '@angular/cdk/drag-drop';
import { DOCUMENT, NgIf, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { IsNightKey, ThemeOptionsKey } from '@config/constant';
import { fnFormatToHump } from '@utils/tools';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SettingInterface, ThemeService } from '@app/core/services/store/theme.service';
import { ThemeSkinService } from '@app/core/services/theme-skin.service';
import { WindowService } from '@app/core/services/window.service';

interface NormalModel {
  image?: string;
  title: string;
  isChecked: boolean;
}

export interface Theme extends NormalModel {
  key: 'dark' | 'light';
}

type SpecialTheme = 'color-weak' | 'grey-theme';
type SpecialThemeHump = 'colorWeak' | 'greyTheme';

interface Color extends NormalModel {
  key: string;
  color: string;
}

export interface ThemeMode extends NormalModel {
  key: 'side' | 'top' | 'mixi';
}

@Component({
  selector: 'app-setting-drawer',
  templateUrl: './setting-drawer.component.html',
  styleUrls: ['./setting-drawer.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CdkDrag, NgIf, NzIconModule, NzButtonModule, NzDrawerModule, NgFor, NzToolTipModule, NzDividerModule, NzListModule, NzSwitchModule, FormsModule]
})
export class SettingDrawerComponent implements OnInit {
  themesOptions$ = this.themesService.getThemesMode();
  isNightTheme$ = this.themesService.getIsNightTheme();
  _isNightTheme = false;
  _themesOptions: SettingInterface = {
    theme: 'light',
    color: '#1890FF',
    mode: 'side',
    fixedTab: false,
    isShowTab: true,
    splitNav: true,
    greyTheme: false,
    colorWeak: false,
    fixedLeftNav: true,
    fixedHead: true,
    hasTopArea: true,
    hasFooterArea: true,
    hasNavArea: true,
    hasNavHeadArea: true
  };
  isCollapsed = false;
  dragging = false;

  themes: Theme[] = [
    {
      key: 'dark',
      image: '/assets/imgs/theme-dark.svg',
      title: 'Dark Menu',
      isChecked: true
    },
    {
      key: 'light',
      image: '/assets/imgs/theme-light.svg',
      title: 'Light Menu',
      isChecked: false
    }
  ];
  colors: Color[] = [
    {
      key: 'dust',
      color: '#F5222D',
      title: 'dust',
      isChecked: false
    },
    {
      key: 'volcano',
      color: '#FA541C',
      title: 'volcano',
      isChecked: false
    },
    {
      key: 'sunset',
      color: '#FAAD14',
      title: 'sunset',
      isChecked: false
    },
    {
      key: 'cyan',
      color: '#13C2C2',
      title: 'cyan',
      isChecked: false
    },
    {
      key: 'green',
      color: '#52C41A',
      title: 'green',
      isChecked: false
    },
    {
      key: 'daybreak',
      color: '#1890FF',
      title: 'daybreak',
      isChecked: true
    },
    {
      key: 'geekblue',
      color: '#2F54EB',
      title: 'geekblue',
      isChecked: false
    },
    {
      key: 'purple',
      color: '#722ED1',
      title: 'purple',
      isChecked: false
    }
  ];
  modes: ThemeMode[] = [
    {
      key: 'side',
      image: '/assets/imgs/menu-side.svg',
      title: 'side menu layout',
      isChecked: true
    },
    {
      key: 'top',
      image: '/assets/imgs/menu-top.svg',
      title: 'top menu layout',
      isChecked: false
    },
    {
      key: 'mixi',
      image: '/assets/imgs/menu-top.svg',
      title: 'mixed menu layout',
      isChecked: false
    }
  ];

  constructor(
    private themesService: ThemeService,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private doc: Document,
    public message: NzMessageService,
    private nzConfigService: NzConfigService,
    private themeSkinService: ThemeSkinService,
    private windowServe: WindowService,
    private rd2: Renderer2
  ) {}

  changeCollapsed(): void {
    if (!this.dragging) {
      this.isCollapsed = !this.isCollapsed;
    } else {
      this.dragging = false;
    }
  }

  changePrimaryColor(color: Color): void {
    this.selOne(color as NormalModel, this.colors);
    this.nzConfigService.set('theme', { primaryColor: color.color });
    this._themesOptions.color = color.color;
    this.setThemeOptions();
  }

  changeNightTheme(isNight: boolean): void {
    this.windowServe.setStorage(IsNightKey, `${isNight}`);
    this.themesService.setIsNightTheme(isNight);
    this.themeSkinService.toggleTheme().then();
  }

  selOne(item: NormalModel, itemArray: NormalModel[]): void {
    itemArray.forEach(_item => (_item.isChecked = false));
    item.isChecked = true;
  }

  changeMode(mode: ThemeMode): void {
    this.selOne(mode, this.modes);
    this.themesService.setIsCollapsed(false);
    this._themesOptions.mode = mode.key;
    this.setThemeOptions();
  }

  changeTheme(themeItem: Theme): void {
    this.selOne(themeItem, this.themes);
    this._themesOptions.theme = themeItem.key;
    this.setThemeOptions();
  }

  setThemeOptions(): void {
    this.themesService.setThemesMode(this._themesOptions);
    this.windowServe.setStorage(ThemeOptionsKey, JSON.stringify(this._themesOptions));
  }

  changeFixed(isTrue: boolean, type: 'isShowTab' | 'splitNav' | 'fixedTab' | 'fixedLeftNav' | 'fixedHead' | 'hasTopArea' | 'hasFooterArea' | 'hasNavArea' | 'hasNavHeadArea'): void {
    if (type === 'fixedHead' && !isTrue) {
      this._themesOptions['fixedTab'] = false;
    }
    this._themesOptions[type] = isTrue;
    this.setThemeOptions();

  }

  changeSpecialTheme(e: boolean, themeType: SpecialTheme): void {
    const name = this.doc.getElementsByTagName('html');
    const theme = fnFormatToHump(themeType);
    if (e) {
      this.rd2.addClass(name[0], themeType);
    } else {
      this.rd2.removeClass(name[0], themeType);
    }
    this._themesOptions[theme as SpecialThemeHump] = e;
    this.setThemeOptions();
  }

  initThemeOption(): void {
    this.isNightTheme$.pipe(first()).subscribe(res => (this._isNightTheme = res));
    this.themesOptions$.pipe(first()).subscribe(res => {
      this._themesOptions = res;
    });

    (['grey-theme', 'color-weak'] as SpecialTheme[]).forEach(item => {
      const specialTheme = fnFormatToHump(item);
      this.changeSpecialTheme(this._themesOptions[specialTheme as SpecialThemeHump], item);
    });

    this.modes.forEach(item => {
      item.isChecked = item.key === this._themesOptions.mode;
    });
    this.colors.forEach(item => {
      item.isChecked = item.color === this._themesOptions.color;
    });
    this.changePrimaryColor(this.colors.find(item => item.isChecked)!);
    this.themes.forEach(item => {
      item.isChecked = item.key === this._themesOptions.theme;
    });
  }

  ngOnInit(): void {
    this.initThemeOption();
  }

  dragEnd(): void {
    if (this.dragging) {
      setTimeout(() => {
        this.dragging = false;
      });
    }
  }
}
