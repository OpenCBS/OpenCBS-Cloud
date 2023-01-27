import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Effect, Actions, ofType} from '@ngrx/effects';

import { LoanProductMakerCheckerService } from './loan-product-maker-checker.service';
import * as loanProductMakerCheckerActions from './loan-product-maker-checker.actions';
import { NgRxAction } from '../../action.interface';


@Injectable()
export class LoanProductMakerCheckerEffects {

  @Effect()
  get_loan_product_maker_checker$ = this.actions$
    .pipe(ofType(loanProductMakerCheckerActions.LOAD_LOAN_PRODUCT_MAKER_CHECKER),
    switchMap((action: NgRxAction) => {
      return this.loanProductMakerCheckerService.getLoanProductMakerChecker(action.payload).pipe(
        map(res => {
          return new loanProductMakerCheckerActions.LoadLoanProductMakerCheckerSuccess(res);
        }),
        catchError(err => {
          const errObj = new loanProductMakerCheckerActions.LoadLoanProductMakerCheckerFailure(err.error);
          return observableOf(errObj);
        }));
    }));

  constructor(
    private loanProductMakerCheckerService: LoanProductMakerCheckerService,
    private actions$: Actions) {
  }
}
