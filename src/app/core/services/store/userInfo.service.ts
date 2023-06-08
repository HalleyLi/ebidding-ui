import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { JwtHelperService } from '@auth0/angular-jwt';
import { UserInfo } from '../login.service';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  private userInfo$ = new BehaviorSubject<UserInfo>({ } as UserInfo);

  constructor() {}

  parsToken(token: string): UserInfo {
    const helper = new JwtHelperService();
    try {
      const { role, userId, id } = helper.decodeToken(token);
      return {
        role,
        name:userId,
        id,
        token
      } as UserInfo;
    } catch (e) {
      return {
        role: '',
        name: 'guest',
        token
      } as UserInfo;
    }
  }

  setUserInfo(userInfo: UserInfo): void {
    this.userInfo$.next(userInfo);
  }

  getUserInfo(): Observable<UserInfo> {
    return this.userInfo$.asObservable();
  }
}
