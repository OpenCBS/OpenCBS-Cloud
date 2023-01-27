import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import { AccountMakerCheckerService } from './account-maker-checker.service';
import * as accountMakerCheckerActions from './account-maker-checker.actions';
import { NgRxAction } from '../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class AccountMakerCheckerEffects {

  @Effect()
  get_account_maker_checker$ = this.actions$
    .pipe(ofType(accountMakerCheckerActions.LOAD_ACCOUNT_MAKER_CHECKER),
      switchMap((action: NgRxAction) => {
        return this.accountMakerCheckerService.getAccountMakerChecker(action.payload).pipe(
          map(res => {
            return new accountMakerCheckerActions.LoadAccountMakerCheckerSuccess(res);
          }),
          catchError((err: HttpErrorResponse) => {
            const errObj = new accountMakerCheckerActions.LoadAccountMakerCheckerFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private accountMakerCheckerService: AccountMakerCheckerService,
    private actions$: Actions) {
  }
}
