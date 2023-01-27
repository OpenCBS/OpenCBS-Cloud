import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { LoanProductListService } from './loan-product-list.service';
import * as loanProductListActions from './loan-product-list.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class LoanProductListEffects {

  @Effect()
  get_loan_product_list$ = this.actions$
    .pipe(ofType(loanProductListActions.LOAD_LOAN_PRODUCTS),
      switchMap((action: NgRxAction) => {
        return this.loanProductListService.getLoanProductList(action.payload).pipe(
          map(res => {
            return new loanProductListActions.LoadLoanProductListSuccess(res);
          }),
          catchError((err: HttpErrorResponse) => {
            const errObj = new loanProductListActions.LoadLoanProductListFail(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private loanProductListService: LoanProductListService,
    private actions$: Actions) {
  }
}
