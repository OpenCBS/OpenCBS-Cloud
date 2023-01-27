import {of as observableOf} from 'rxjs';

import {catchError, map, switchMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import {GlobalPermissionsService} from './global-permissions.service';
import * as globalPermissionsActions from './global-permissions.actions';
import {HttpErrorResponse} from '@angular/common/http';


@Injectable()
export class GlobalPermissionsEffect {

  @Effect()
  get_global_permissions$ = this.actions$.pipe(
    ofType(globalPermissionsActions.LOAD_GLOBAL_PERMISSIONS),
    switchMap(action => {
      return this.globalPermissionsService.getGlobalPermissions().pipe(
        map(res => {
          return new globalPermissionsActions.LoadGlobalPermissionsSuccess(res);
        }),
        catchError((err: HttpErrorResponse) => {
          const errObj = new globalPermissionsActions.LoadGlobalPermissionsFailure(err.error);
          return observableOf(errObj);
        }));
    }));

  constructor(private globalPermissionsService: GlobalPermissionsService,
              private actions$: Actions) {
  }
}
