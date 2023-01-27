import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { RoleCreateService } from './role-create.service';
import * as roleCreateActions from './role-create.actions';
import { NgRxAction } from '../../action.interface';


@Injectable()
export class RoleCreateEffects {

  @Effect()
  create_role$ = this.actions$
    .pipe(ofType(roleCreateActions.CREATE_ROLE),
      switchMap((action: NgRxAction) => {
        return this.roleCreateService.createRole(action.payload).pipe(
          map(
            res => new roleCreateActions.CreateRoleSuccess(res)),
          catchError(err => {
            const errObj = new roleCreateActions.CreateRoleFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private roleCreateService: RoleCreateService,
    private actions$: Actions) {
  }
}
