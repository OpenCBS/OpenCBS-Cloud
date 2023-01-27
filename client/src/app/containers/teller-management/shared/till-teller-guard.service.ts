import { tap, map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/internal/Rx';


import { CurrentUserService } from '../../../core/store/users/current-user/currentUser.service';


@Injectable()
export class TillTellerGuard implements CanActivate {
  constructor(private router: Router,
              private currentUserService: CurrentUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.currentUserService.currentUserPermissions$.pipe(
      take(1),
      map(permissions => {
        return permissions.some(item => {
          if (item['group'] === 'TELLER_MANAGEMENT') {
            return item['permissions'].some(permission => {
              return (permission === 'TELLER' || permission === 'HEAD_TELLER')
            });
          }
        });
      }),
      tap(bool => {
        if (!bool) {
          this.router.navigate(['dashboard']);
        }
        return bool;
      }));
  }
}
