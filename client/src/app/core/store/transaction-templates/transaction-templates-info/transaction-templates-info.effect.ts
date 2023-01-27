import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { TransactionTemplatesInfoService } from './transaction-templates-info.service';
import * as transactionTemplatesActions from './transaction-templates-info.actions';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class TransactionTemplatesEffects {

  @Effect()
  get_transaction_templates = this.actions$
    .pipe(ofType(transactionTemplatesActions.LOAD_TRANSACTION_TEMPLATES_INFO)).pipe(
      switchMap((action: transactionTemplatesActions.TransactionTemplatesInfoActions) => {
        return this.transactionTemplatesService.getTransactionTemplates(action.payload).pipe(
          map(res => new transactionTemplatesActions.LoadTransactionTemplatesInfoSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new transactionTemplatesActions.LoadTransactionTemplatesInfoFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private transactionTemplatesService: TransactionTemplatesInfoService,
    private actions$: Actions) {
  }
}
