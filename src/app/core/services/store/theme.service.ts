import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Theme, ThemeMode } from '@app/layout/default/setting-drawer/setting-drawer.component';

export interface SettingInterface {
  theme: Theme['key']; 
  color: string; 
  mode: ThemeMode['key']; 
  colorWeak: boolean; 
  greyTheme: boolean; 
  fixedHead: boolean; 
  splitNav: boolean; 
  fixedLeftNav: boolean; 
  isShowTab: boolean; 
  fixedTab: boolean; 
  hasTopArea: boolean; 
  hasFooterArea: boolean; 
  hasNavArea: boolean; 
  hasNavHeadArea: boolean; 
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isNightTheme$ = new BehaviorSubject<boolean>(false);
  private isOverModeTheme$ = new BehaviorSubject<boolean>(false);
  private themesMode$ = new BehaviorSubject<SettingInterface>({
    theme: 'dark',
    color: '#1890FF',
    mode: 'side',
    isShowTab: true,
    colorWeak: false,
    greyTheme: false,
    splitNav: false,
    fixedTab: true,
    fixedHead: true,
    fixedLeftNav: true,
    hasTopArea: true,
    hasFooterArea: true,
    hasNavArea: true,
    hasNavHeadArea: true
  });

  private isCollapsed$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  
  setThemesMode(mode: SettingInterface): void {
    this.themesMode$.next(mode);
  }

  getThemesMode(): Observable<SettingInterface> {
    return this.themesMode$.asObservable();
  }

  
  setIsNightTheme(isNight: boolean): void {
    this.isNightTheme$.next(isNight);
  }

  getIsNightTheme(): Observable<boolean> {
    return this.isNightTheme$.asObservable();
  }

  
  setIsOverMode(isNight: boolean): void {
    this.isOverModeTheme$.next(isNight);
  }

  getIsOverMode(): Observable<boolean> {
    return this.isOverModeTheme$.asObservable();
  }

  
  setIsCollapsed(isCollapsed: boolean): void {
    this.isCollapsed$.next(isCollapsed);
  }

  getIsCollapsed(): Observable<boolean> {
    return this.isCollapsed$.asObservable();
  }
}
