import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import { LoanProductCreateService } from './loan-product-create.service';
import * as loanProductCreateActions from './loan-product-create.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class LoanProductCreateEffects {

  @Effect()
  create_loan_product$ = this.actions$
    .pipe(ofType(loanProductCreateActions.CREATE_LOAN_PRODUCT),
      switchMap((action: NgRxAction) => {
        return this.loanProductCreateService.createLoanProduct(action.payload).pipe(
          map(
            res => new loanProductCreateActions.CreateLoanProductSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new loanProductCreateActions.CreateLoanProductFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private loanProductCreateService: LoanProductCreateService,
    private actions$: Actions) {
  }
}
