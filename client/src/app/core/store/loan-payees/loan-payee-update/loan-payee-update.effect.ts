import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as loanPayeeUpdateActions from './loan-payee-update.actions';
import { LoanPayeeUpdateService } from './loan-payee-update.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class LoanPayeeUpdateEffects {

  @Effect()
  update_loanPayee$ = this.actions$
    .pipe(ofType(loanPayeeUpdateActions.UPDATE_LOAN_PAYEE),
      switchMap((action: NgRxAction) => {
        return this.loanPayeeUpdateService.updateLoanPayee(
          action.payload.loanApplicationId,
          action.payload.data,
          action.payload.loanAppId).pipe(
          map(
            res => {
              return new loanPayeeUpdateActions.UpdateLoanPayeeSuccess(res);
            }
          ),
          catchError((err: HttpErrorResponse) => {
            const errObj = new loanPayeeUpdateActions.UpdateLoanPayeeFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  @Effect()
  disburse_loan_payee$ = this.actions$
    .pipe(ofType(loanPayeeUpdateActions.DISBURSE_PAYEE),
      switchMap((action: NgRxAction) => {
        return this.loanPayeeUpdateService.disburseLoanPayee(
          action.payload.loanApplicationId,
          action.payload.payeeId,
          action.payload.data).pipe(
          map(res => {
            return new loanPayeeUpdateActions.UpdateLoanPayeeSuccess(res);
          }),
          catchError((err: HttpErrorResponse) => {
            const errObj = new loanPayeeUpdateActions.UpdateLoanPayeeFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  @Effect()
  refund_loan_payee$ = this.actions$
    .pipe(ofType(loanPayeeUpdateActions.REFUND_LOAN_PAYEE),
      switchMap((action: NgRxAction) => {
        return this.loanPayeeUpdateService.refundLoanPayee(action.payload.payeeId, action.payload.data).pipe(
          map(res => {
            return new loanPayeeUpdateActions.UpdateLoanPayeeSuccess(res);
          }),
          catchError((err: HttpErrorResponse) => {
            const errObj = new loanPayeeUpdateActions.UpdateLoanPayeeFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private loanPayeeUpdateService: LoanPayeeUpdateService,
              private actions$: Actions) {
  }
}
