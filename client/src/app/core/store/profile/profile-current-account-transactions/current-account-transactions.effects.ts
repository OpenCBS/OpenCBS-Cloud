import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';


import { CurrentAccountTransactionsService } from './current-account-transactions.service';
import * as currentAccountTransactionsActions from './current-account-transactions.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class CurrentAccountTransactionsEffects {

  @Effect()
  get_transactions$ = this.actions$
    .pipe(ofType(currentAccountTransactionsActions.LOAD_CA_TRANSACTIONS),
      switchMap((action: NgRxAction) => {
        return this.currentAccountTransactionsService.getCurrentAccountTransactions(action.payload)
          .pipe(
            map(res => new currentAccountTransactionsActions.LoadCurrentAccountTransactionsSuccess(res)),
            catchError((err: HttpErrorResponse) => {
              const errObj = new currentAccountTransactionsActions.LoadCurrentAccountTransactionsFailure(err.error);
              return observableOf(errObj);
            }));
      }));

  constructor(private currentAccountTransactionsService: CurrentAccountTransactionsService,
              private actions$: Actions) {
  }
}
