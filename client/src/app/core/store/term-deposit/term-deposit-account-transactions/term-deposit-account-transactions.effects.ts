
import {of as observableOf,  Observable } from 'rxjs';

import {catchError, map, switchMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { TermDepositAccountTransactionsService } from './term-deposit-account-transactions.service';
import * as termDepositAccountTransactionsActions from './term-deposit-account-transactions.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class TermDepositAccountTransactionsEffects {

  @Effect()
  get_transactions$ = this.actions$
    .pipe(ofType(termDepositAccountTransactionsActions.LOAD_TDA_TRANSACTIONS),
    switchMap((action: NgRxAction) => {
      return this.termDepositAccountTransactionsService.getTermDepositAccountTransactions(action.payload).pipe(
        map(res => new termDepositAccountTransactionsActions.LoadTermDepositAccountTransactionsSuccess(res)),
        catchError((err: HttpErrorResponse) => {
          const errObj = new termDepositAccountTransactionsActions.LoadTermDepositAccountTransactionsFailure(err.error);
          return observableOf(errObj);
        }),);
    }));

  constructor(private termDepositAccountTransactionsService: TermDepositAccountTransactionsService,
              private actions$: Actions) {
  }
}
