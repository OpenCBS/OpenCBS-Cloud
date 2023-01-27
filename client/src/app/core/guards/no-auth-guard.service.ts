import { tap, map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../store/auth';

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router,
              private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | boolean {

    return this.authService.isAuthenticated.pipe(
      take(1),
      map(bool => !bool),
      tap((isAuth) => {
        if (!isAuth && state.url === '/login') {
          this.router.navigate(['/profiles']);
          return isAuth;
        }
        return isAuth;
      }));
  }
}
