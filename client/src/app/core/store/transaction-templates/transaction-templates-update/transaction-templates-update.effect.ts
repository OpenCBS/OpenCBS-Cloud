import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';


import { TransactionTemplatesUpdateService } from './transaction-templates-update.service';
import * as transactionTemplatesUpdateActions from './transaction-templates-update.actions';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class TransactionTemplatesUpdateEffects {

  @Effect()
  update_transaction_templates = this.actions$
    .pipe(ofType(transactionTemplatesUpdateActions.UPDATE_TRANSACTION_TEMPLATES)).pipe(
      switchMap((action: transactionTemplatesUpdateActions.TransactionTemplatesUpdateActions) => {
        return this.transactionTemplatesUpdateService.updateTransactionTemplates(action.payload.transactionTemplates, action.payload.id)
          .pipe(
            map(
              res => new transactionTemplatesUpdateActions.UpdateTransactionTemplatesSuccess(res)),
            catchError((err: HttpErrorResponse) => {
              const errObj = new transactionTemplatesUpdateActions.UpdateTransactionTemplatesFailure(err.error);
              return observableOf(errObj);
            }));
      }));

  constructor(
    private transactionTemplatesUpdateService: TransactionTemplatesUpdateService,
    private actions$: Actions) {
  }
}
