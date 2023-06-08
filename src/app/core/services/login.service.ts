import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Menu } from '@core/services/types';
import { BaseHttpService } from './base-http.service';
import { CLIENT_MENUS, SALES_MENUS } from '@app/config/menu';

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

export interface UserInfo {
  id?: string;
  name: string;
  memberSince?: string;
  role: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    public http: BaseHttpService
  ) {}

  public login(params: LoginParams): Observable<UserInfo> {
    return this.http.post('/api/v1/account/login', params, { needSuccessInfo: false });
  }

  public logout(params: LogoutParams): Observable<LogoutResult> {
    return this.http.post('/api/v1/account/logout', params, { needSuccessInfo: false });
  }

  public getMenuByUserId(role: string): Observable<Menu[]> {
    if(role===Role.CLIENT){
      return of(CLIENT_MENUS);
    }
    if(role===Role.SALES){
      return of(SALES_MENUS);
    }
    return of([]);
  }

}
