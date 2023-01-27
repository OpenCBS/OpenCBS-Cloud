import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { TermDepositProductUpdateService } from './term-deposit-product-update.service';
import * as termDepositProductUpdateActions from './term-deposit-product-update.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class TermDepositProductUpdateEffects {

  @Effect()
  update_term_deposit_product$ = this.actions$
    .pipe(ofType(termDepositProductUpdateActions.UPDATE_TERM_DEPOSIT_PRODUCT),
      switchMap((action: NgRxAction) => {
        return this.termDepositProductUpdateService.updateTermDepositProduct(
          action.payload.termDepositProductForm,
          action.payload.termDepositProductId
        ).pipe(
          map(
            res => new termDepositProductUpdateActions.UpdateTermDepositProductSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new termDepositProductUpdateActions.UpdateTermDepositProductFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private termDepositProductUpdateService: TermDepositProductUpdateService,
    private actions$: Actions) {
  }
}
