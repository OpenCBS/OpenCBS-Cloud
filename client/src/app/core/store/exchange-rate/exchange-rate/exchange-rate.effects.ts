
import {of as observableOf,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {Effect, Actions, ofType} from '@ngrx/effects';


import { ExchangeRateService } from './exchange-rate.service';
import * as exchangeRateActions from './exchange-rate.actions';
import { NgRxAction } from '../../action.interface';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable()
export class ExchangeRateEffects {

  @Effect()
  get_transactions$ = this.actions$
    .pipe(ofType(exchangeRateActions.LOAD_ER_TRANSACTIONS),
  switchMap((action: NgRxAction) => {
    return this.exchangeRateService.getExchangeRate(action.payload)
    .pipe(map(res => {
        return new exchangeRateActions.LoadExchangeRateSuccess(res);
      }),
      catchError(err => {
        const errObj = new exchangeRateActions.LoadExchangeRateFailure(err.error);
        return observableOf(errObj);
      }));
  }));

  constructor(private exchangeRateService: ExchangeRateService,
              private actions$: Actions) {
  }
}
