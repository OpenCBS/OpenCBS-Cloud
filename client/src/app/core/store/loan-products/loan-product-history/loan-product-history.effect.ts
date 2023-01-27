import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import { LoanProductHistoryService } from './loan-product-history.service';
import * as loanProductHistoryActions from './loan-product-history.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class LoanProductHistoryEffects {

  @Effect()
  get_loan_product_history$ = this.actions$
    .pipe(ofType(loanProductHistoryActions.LOAD_LOAN_PRODUCT_HISTORY),
      switchMap((action: NgRxAction) => {
        return this.loanProductHistoryService.getLoanProductHistory(action.payload).pipe(
          map(res => new loanProductHistoryActions.LoadLoanProductHistorySuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new loanProductHistoryActions.LoadLoanProductHistoryFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private loanProductHistoryService: LoanProductHistoryService,
    private actions$: Actions) {
  }
}
