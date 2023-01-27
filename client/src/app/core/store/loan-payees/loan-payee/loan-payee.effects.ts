import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import * as loanPayeeActions from './loan-payee.actions';
import { LoanPayeeInfoService } from './loan-payee.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class LoanPayeeEffects {

  @Effect()
  load_loan_payee$ = this.actions$
    .pipe(ofType(loanPayeeActions.LOAD_LOAN_PAYEE),
      switchMap((action: NgRxAction) => {
        return this.loanPayeeInfoService.loadLoanPayee(action.payload)
          .pipe(
            map(res => new loanPayeeActions.LoadLoanPayeeSuccess(res)),
            catchError((err: HttpErrorResponse) => {
              const errObj = new loanPayeeActions.LoadLoanPayeeFailure(err.error);
              return observableOf(errObj);
            }));
      }));

  constructor(private loanPayeeInfoService: LoanPayeeInfoService,
              private actions$: Actions) {
  }
}
