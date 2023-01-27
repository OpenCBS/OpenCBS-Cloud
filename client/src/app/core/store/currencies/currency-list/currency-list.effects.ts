import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import * as currencyListActions from './currency-list.actions';
import { CurrencyListService } from './currency-list.service';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class CurrencyListEffects {

  @Effect()
  load_currencies$: Observable<Action> = this.actions$
    .pipe(ofType(currencyListActions.LOAD_CURRENCIES),
      switchMap(() => {
        return this.currencyListService.getCurrencyList().pipe(map(
          res => new currencyListActions.LoadCurrenciesSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new currencyListActions.LoadCurrenciesFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private currencyListService: CurrencyListService,
    private actions$: Actions) {
  }
}
