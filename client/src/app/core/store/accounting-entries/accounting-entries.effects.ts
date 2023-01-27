import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AccountingEntriesService } from './accounting-entries.service';
import * as accountingEntriesActions from './accounting-entries.actions'


@Injectable()
export class AccountingEntriesEffects {
  @Effect()
  get_entries$ = this.actions$
    .pipe(ofType(accountingEntriesActions.LOAD_ACCOUNTING_ENTRIES),
      switchMap((action: accountingEntriesActions.AccountingEntriesActions) => {
        return this.entriesService.getAccountingEntries(action.payload).pipe(
          map(res => {
            return new accountingEntriesActions.LoadAccountingEntriesSuccess(res);
          }),
          catchError(err => {
            const errObj = new accountingEntriesActions.LoadAccountingEntriesFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private entriesService: AccountingEntriesService,
              private actions$: Actions) {
  }
}
