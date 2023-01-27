import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { UserMakerCheckerService } from './user-maker-checker.service';
import * as userMakerCheckerActions from './user-maker-checker.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class UserMakerCheckerEffect {

  @Effect()
  get_user_maker_checker$ = this.actions$
    .pipe(ofType(userMakerCheckerActions.LOAD_USER_MAKER_CHECKER),
      switchMap((action: NgRxAction) => {
        return this.userMakerCheckerService.getUserMakerChecker(action.payload).pipe(
          map(res => new userMakerCheckerActions.LoadUserMakerCheckerSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new userMakerCheckerActions.LoadUserMakerCheckerFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private userMakerCheckerService: UserMakerCheckerService,
    private actions$: Actions) {
  }
}
