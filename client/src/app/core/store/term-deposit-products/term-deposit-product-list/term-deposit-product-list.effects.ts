import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { TermDepositProductListService } from './term-deposit-product-list.service';
import * as termDepositProductListActions from './term-deposit-product-list.actions';
import { NgRxAction } from '../../action.interface';


@Injectable()
export class TermDepositProductListEffects {

  @Effect()
  get_loan_product_list$ = this.actions$
    .pipe(ofType(termDepositProductListActions.LOAD_TERM_DEPOSIT_PRODUCTS),
      switchMap((action: NgRxAction) => {
        return this.termDepositProductListService.getTermDepositProductList(action.payload).pipe(
          map(res => {
            return new termDepositProductListActions.LoadTermDepositProductListSuccess(res);
          }),
          catchError(err => {
            const errObj = new termDepositProductListActions.LoadTermDepositProductListFail(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private termDepositProductListService: TermDepositProductListService,
    private actions$: Actions) {
  }
}
