import { assertInInjectionContext, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

import { TokenKey } from '@config/constant';

import { WindowService } from '../window.service';

// 有兴趣的可以看看class与fn的争议https://github.com/angular/angular/pull/47924
const canActivateChildFn: CanActivateFn = () => {
  assertInInjectionContext(canActivateChildFn);
  const windowSrc = inject(WindowService);
  const router = inject(Router);

  const isLogin = !!windowSrc.getSessionStorage(TokenKey);
  if (isLogin) {
    return true;
  }
  return router.parseUrl('/login');
};

export const JudgeLoginGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return canActivateChildFn(childRoute, state);
};
