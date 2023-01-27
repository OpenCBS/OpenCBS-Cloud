import {of as observableOf } from 'rxjs';
import { Injectable } from '@angular/core';
import {Effect, Actions, ofType} from '@ngrx/effects';


import { PaymentGatewayService } from './payment-gateway.service';
import * as paymentGatewayActions from './payment-gateway.actions';
import { NgRxAction } from '../../action.interface';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable()
export class PaymentGatewayEffects {

  @Effect()
  get_payment_gateway$ = this.actions$
    .pipe(ofType(paymentGatewayActions.LOAD_PAYMENT_GATEWAY),
  switchMap((action: NgRxAction) => {
    return this.paymentGatewayService.getPaymentGateway(action.payload)
    .pipe(map(res => {
        return new paymentGatewayActions.LoadPaymentGatewaySuccess(res);
      }),
      catchError(err => {
        const errObj = new paymentGatewayActions.LoadPaymentGatewayFailure(err.error);
        return observableOf(errObj);
      }));
  }));

  constructor(private paymentGatewayService: PaymentGatewayService,
              private actions$: Actions) {
  }
}
