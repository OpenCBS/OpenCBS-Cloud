import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { TransactionTemplatesCreateService } from './transaction-templates-create.service';
import * as transactionTemplatesCreateActions from './transaction-templates-create.actions';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class TransactionTemplatesCreateEffects {

  @Effect()
  create_transaction_templates$ = this.actions$
    .pipe(ofType(transactionTemplatesCreateActions.CREATE_TRANSACTION_TEMPLATES)).pipe(
      switchMap((action: transactionTemplatesCreateActions.TransactionTemplatesCreateActions) => {
        return this.transactionTemplatesCreateService.createTransactionTemplates(action.payload).pipe(
          map(
            res => new transactionTemplatesCreateActions.CreateTransactionTemplatesSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new transactionTemplatesCreateActions.CreateTransactionTemplatesFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private transactionTemplatesCreateService: TransactionTemplatesCreateService,
    private actions$: Actions) {
  }
}
