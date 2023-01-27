import { map, take, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { CurrentUserService } from '../store/users/current-user/index';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../core.reducer';


@Injectable()
export class RouteGuard implements CanActivate, CanActivateChild {
  private currentUserSub;
  private currentUser;

  constructor(private router: Router,
              private currentUserService: CurrentUserService,
              private store$: Store<fromRoot.State>) {
    this.currentUserSub = this.store$.pipe(select(fromRoot.getCurrentUserState))
      .subscribe(user => {
        if ( user.loaded && user.success && !user.error ) {
          this.currentUser = user;
        }
      });
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | boolean {
    const roles: string[] = route.data['roles'];
    const groupName = route.data['groupName'];
    return this.currentUserService.currentUserPermissions$.pipe(
      take(1),
      map(groups => {
        if ( this.currentUser && this.currentUser['isAdmin'] ) {
          return true
        } else {
          return groups.some(item => {
            if ( groupName ) {
              return item['group'] === groupName;
            } else {
              return item['permissions'].some(permission => {
                return roles.includes(permission);
              });
            }
          });
        }
      }),
      tap(bool => {
        if ( !bool ) {
          this.router.navigate(['dashboard']);
        }
        return bool;
      }));
  }

  canActivateChild(route: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot): Observable<boolean> | boolean {
    const groupName = route.data['groupName'];
    return this.currentUserService.currentUserPermissions$.pipe(
      take(1),
      map(permissions => {
        return permissions.some(item => {
          return item['group'] === groupName;
        });
      }),
      tap(bool => {
        if ( !bool ) {
          this.router.navigate(['dashboard']);
        }
        return bool;
      }));
  }
}
