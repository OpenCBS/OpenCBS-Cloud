import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CurrentUserService } from './currentUser.service';
import * as CurrentUserActions from './currentUser.actions';
import { AuthAppState } from '../../auth';
import * as authActions from '../../auth/auth.actions';
import * as globalPermissionsActions from '../../global-permissions/global-permissions.actions';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class CurrentUserEffects {

  @Effect()
  get_current_user$ = this.actions$.pipe(
    ofType(CurrentUserActions.LOAD_CURRENT_USER),
    switchMap(action => {
      return this.currentUserService.getCurrentUser().pipe(
        map(res => {
          this.store$.dispatch(new authActions.LoginSucceeded());
          this.store$.dispatch(new globalPermissionsActions.LoadGlobalPermissions());
          return new CurrentUserActions.LoadCurrentUserSuccess(res);
        }),
        catchError((err: HttpErrorResponse) => {
          this.store$.dispatch(new authActions.PurgeAuth());
          const errObj = new CurrentUserActions.LoadCurrentUserFailure(err.error);
          return observableOf(errObj);
        }));
    }));

  constructor(private currentUserService: CurrentUserService,
              private actions$: Actions,
              private store$: Store<AuthAppState>) {
  }
}
