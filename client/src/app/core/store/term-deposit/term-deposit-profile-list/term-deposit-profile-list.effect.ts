import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as termDepositProfileListActions from './term-deposit-profile-list.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { TermDepositProfileListService } from './term-deposit-profile-list.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class TermDepositProfileListEffects {
  @Effect()
  load_term_deposit_profile$: Observable<Action> = this.actions$
    .pipe(ofType(termDepositProfileListActions.LOAD_TERM_DEPOSITS_PROFILE),
      switchMap((action: NgRxAction) => {
        return this.termDepositProfileListService.getProfileTermDepositList(action.payload).pipe(
          map(
            res => new termDepositProfileListActions.LoadTermDepositsProfileSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new termDepositProfileListActions.LoadTermDepositsProfileFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private termDepositProfileListService: TermDepositProfileListService,
              private actions$: Actions) {
  }
}
