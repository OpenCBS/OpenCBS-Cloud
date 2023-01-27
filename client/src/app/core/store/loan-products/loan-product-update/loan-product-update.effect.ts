import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { LoanProductUpdateService } from './loan-product-update.service';
import * as loanProductUpdateActions from './loan-product-update.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class LoanProductUpdateEffects {

  @Effect()
  update_loan_product$ = this.actions$
    .pipe(ofType(loanProductUpdateActions.UPDATE_LOAN_PRODUCT),
      switchMap((action: NgRxAction) => {
        return this.loanProductUpdateService.updateLoanProduct(action.payload.loanProductForm, action.payload.loanProductId).pipe(
          map(
            res => new loanProductUpdateActions.UpdateLoanProductSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new loanProductUpdateActions.UpdateLoanProductFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private loanProductUpdateService: LoanProductUpdateService,
    private actions$: Actions) {
  }
}
