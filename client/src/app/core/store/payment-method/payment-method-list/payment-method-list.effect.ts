import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';


import * as paymentMethodListActions from './payment-method-list.actions';
import { PaymentMethodListService } from './payment-method-list.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class PaymentMethodListEffects {

  @Effect()
  load_payment_methods$: Observable<NgRxAction> = this.actions$
    .pipe(ofType(paymentMethodListActions.LOAD_PAYMENT_METHODS),
      switchMap((action) => {
        return this.paymentMethodListService.getPaymentMethodList().pipe(
          map(
            res => new paymentMethodListActions.LoadPaymentMethodsSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new paymentMethodListActions.LoadPaymentMethodsFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private paymentMethodListService: PaymentMethodListService,
    private actions$: Actions) {
  }
}
