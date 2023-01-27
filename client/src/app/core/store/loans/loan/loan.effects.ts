import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as loanInfoActions from './loan.actions';
import { LoanInfoService } from './loan.service';
import { NgRxAction } from '../../action.interface';

@Injectable()
export class LoanInfoEffects {

  @Effect()
  load_loan_info$ = this.actions$
    .pipe(ofType(loanInfoActions.LOAD_LOAN_INFO)).pipe(
      switchMap((action: NgRxAction) => {
        return this.loanInfoService.loadLoanInfo(action.payload.id, action.payload.loanType)
          .pipe(
            map(res => {
              return new loanInfoActions.LoadLoanInfoSuccess(res);
            }),
            catchError(err => {
              const errObj = new loanInfoActions.LoadLoanInfoFailure(err.error);
              return observableOf(errObj);
            }));
      }));

  constructor(private loanInfoService: LoanInfoService,
              private actions$: Actions) {
  }
}
