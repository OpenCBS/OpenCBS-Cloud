import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import * as userCreateActions from './user-create.actions';
import { UserCreateService } from './user-create.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class UserCreateEffects {

  @Effect()
  create_user$: Observable<NgRxAction> = this.actions$
    .pipe(ofType(userCreateActions.CREATE_USER),
      switchMap((action: NgRxAction) => {
        return this.userCreateService.createUser(action.payload).pipe(
          map(
            res => new userCreateActions.CreateUserSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new userCreateActions.CreateUserFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private userCreateService: UserCreateService,
    private actions$: Actions) {
  }
}
