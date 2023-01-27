import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import { TermDepositProductInfoService } from './term-deposit-product-info.service';
import * as termDepositProductActions from './term-deposit-product-info.actions';
import { NgRxAction } from '../../action.interface';


@Injectable()
export class TermDepositProductInfoEffects {

  @Effect()
  get_term_deposit_product$ = this.actions$
    .pipe(ofType(termDepositProductActions.LOAD_TERM_DEPOSIT_PRODUCT),
      switchMap((action: NgRxAction) => {
        return this.termDepositProductService.getTermDepositProductInfo(action.payload).pipe(
          map(res => new termDepositProductActions.LoadTermDepositProductSuccess(res)),
          catchError(err => {
            const errObj = new termDepositProductActions.LoadTermDepositProductFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private termDepositProductService: TermDepositProductInfoService,
    private actions$: Actions) {
  }
}
