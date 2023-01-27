import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';


import { TransactionTemplatesListService } from './transaction-templates-list.service';
import * as transactionTemplatesListActions from './transaction-templates-list.actions';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class TransactionTemplatesListEffect {

  @Effect()
  get_transaction_templates_list$ = this.actions$
    .pipe(ofType(transactionTemplatesListActions.LOAD_TRANSACTION_TEMPLATES_LIST)).pipe(
      switchMap((action: transactionTemplatesListActions.TransactionTemplatesListActions) => {
        return this.transactionTemplatesListService.getTransactionTemplatesList(action.payload).pipe(
          map(res => {
            return new transactionTemplatesListActions.LoadTransactionTemplatesListSuccess(res);
          }),
          catchError((err: HttpErrorResponse) => {
            const errObj = new transactionTemplatesListActions.LoadTransactionTemplatesListFail(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private transactionTemplatesListService: TransactionTemplatesListService,
              private actions$: Actions) {
  }
}
