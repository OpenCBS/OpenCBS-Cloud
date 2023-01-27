import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { RoleMakerCheckerService } from './role-maker-checker.service';
import * as roleMakerCheckerActions from './role-maker-checker.actions';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class RoleMakerCheckerEffects {

  @Effect()
  get_role$ = this.actions$
    .pipe(ofType(roleMakerCheckerActions.LOAD_ROLE_MAKER_CHECKER),
      switchMap((action: roleMakerCheckerActions.RoleMakerCheckerActions) => {
        return this.roleService.getRoleContent(action.payload).pipe(
          map(res => new roleMakerCheckerActions.LoadRoleMakerCheckerSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new roleMakerCheckerActions.LoadRoleMakerCheckerFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private roleService: RoleMakerCheckerService,
    private actions$: Actions) {
  }
}
