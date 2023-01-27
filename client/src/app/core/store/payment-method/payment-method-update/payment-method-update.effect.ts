import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';


import { PaymentMethodUpdateService } from './payment-method-update.service';
import * as paymentMethodUpdateActions from './payment-method-update.actions';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class PaymentMethodUpdateEffects {

  @Effect()
  update_payment_method$ = this.actions$
    .pipe(ofType(paymentMethodUpdateActions.UPDATE_PAYMENT_METHOD),
      switchMap((action: paymentMethodUpdateActions.PaymentMethodUpdateActions) => {
        return this.paymentMethodUpdateService.updatePaymentMethod(action.payload.data, action.payload.fieldId).pipe(
          map(
            res => new paymentMethodUpdateActions.UpdatePaymentMethodSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new paymentMethodUpdateActions.UpdatePaymentMethodFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private paymentMethodUpdateService: PaymentMethodUpdateService,
    private actions$: Actions) {
  }
}
