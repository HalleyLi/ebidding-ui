import { Inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

// import { MENU_TOKEN } from '@config/menu';
import { Menu } from '@core/services/types';
import { BaseHttpService } from './base-http.service';
import { MENU_TOKEN } from '@app/config/menu';

export enum Role {
  SALES = "TRADER",
  CLIENT = 'CLIENT'
};

export interface LoginParams {
  username: string;
  password: string;
}

export interface LogoutParams {
  token: string;
}

export interface LogoutResult {
  code: string;
  message: string;
  success: boolean;
  /** auth token */
  token: string;
}

export interface Account {
  id: string;
  name: string;
  memberSince: string;
  role: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    public http: BaseHttpService,
    @Inject(MENU_TOKEN) public menus: Menu[],
  ) {}

  public login(params: LoginParams): Observable<Account> {
    return this.http.post('/api/v1/account/login', params, { needSuccessInfo: false });
  }

  public logout(params: LogoutParams): Observable<LogoutResult> {
    return this.http.post('/api/v1/account/logout', params, { needSuccessInfo: false });
  }

  public getMenuByUserId(userId: number): Observable<Menu[]> {
    return of(this.menus);
  }

}
