import { map, take, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs/internal/Observable';


import { AuthService, RouteService } from '../store/auth';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router,
              private authService: AuthService,
              private routeService: RouteService) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.authService.isAuthenticated.pipe(
      take(1),
      map(item => {
        return item;
      }),
      tap((isAuth) => {
        if (!isAuth) {
          this.routeService.redirectUrl = state.url;
          this.router.navigate(['login']);
          return isAuth;
        }
        return isAuth;
      }));
  }

  canActivateChild(route: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.authService.isAuthenticated.pipe(
      take(1),
      map(item => {
        return item;
      }),
      tap((isAuth) => {
        if (!isAuth) {
          this.routeService.redirectUrl = state.url;
          this.router.navigate(['login']);
          return isAuth;
        }
        return isAuth;
      }));
  }
}
