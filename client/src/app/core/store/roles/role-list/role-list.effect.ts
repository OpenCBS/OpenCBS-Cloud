import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { RoleListService } from './role-list.service';
import * as roleListActions from './role-list.actions';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class RoleListEffect {

  @Effect()
  get_role_list$ = this.actions$
    .pipe(ofType(roleListActions.LOAD_ROLES),
      switchMap((action: roleListActions.RoleListActions) => {
        return this.roleListService.getRoleList(action.payload).pipe(
          map(res => new roleListActions.LoadRoleListSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new roleListActions.LoadRoleListFail(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private roleListService: RoleListService,
    private actions$: Actions) {
  }
}
