import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { UserService } from './user.service';
import * as userActions from './user.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class UserEffect {

  @Effect()
  get_user$ = this.actions$
    .pipe(ofType(userActions.LOAD_USER),
      switchMap((action: NgRxAction) => {
        return this.userService.getUser(action.payload).pipe(
          map(res => new userActions.LoadUserSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new userActions.LoadUserFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private userService: UserService,
    private actions$: Actions) {
  }
}
