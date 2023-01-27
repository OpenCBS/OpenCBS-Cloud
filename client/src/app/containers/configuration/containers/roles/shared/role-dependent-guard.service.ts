import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../../core/store'
import { RoleListState, getRoles } from '../../../../../core/store';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class DependentOnRolesGuard implements CanActivate {
  constructor(private roleStore$: Store<RoleListState>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    this.roleStore$.pipe((getRoles())).subscribe(roles => {
      if (!roles) {
        this.roleStore$.dispatch(new fromStore.LoadRoleList());
        return true;
      } else {
        return true;
      }
    });
    return true;
  }
}
