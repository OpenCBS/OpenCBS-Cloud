import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { RoleUpdateService } from './role-update.service';
import * as roleUpdateActions from './role-update.actions';
import { NgRxAction } from '../../action.interface';


@Injectable()
export class RoleUpdateEffects {

  @Effect()
  update_role$ = this.actions$
    .pipe(ofType(roleUpdateActions.UPDATE_ROLE),
      switchMap((action: NgRxAction) => {
        return this.roleUpdateService.updateRole(action.payload.data, action.payload.roleId).pipe(
          map(
            res => new roleUpdateActions.UpdateRoleSuccess(res)),
          catchError(err => {
            const errObj = new roleUpdateActions.UpdateRoleFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private roleUpdateService: RoleUpdateService,
    private actions$: Actions) {
  }
}
