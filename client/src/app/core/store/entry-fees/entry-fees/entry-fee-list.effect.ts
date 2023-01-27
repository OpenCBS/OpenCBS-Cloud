import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import * as entryFeeListActions from './entry-fee-list.actions';
import { EntryFeeListService } from './entry-fee-list.service';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class EntryFeeListEffects {

  @Effect()
  load_entryFees$: Observable<Action> = this.actions$
    .pipe(ofType(entryFeeListActions.LOAD_ENTRY_FEES),
      switchMap((action) => {
        return this.entryFeeListService.getEntryFeeList().pipe(
          map(
            res => new entryFeeListActions.LoadEntryFeesSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new entryFeeListActions.LoadEntryFeesFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private entryFeeListService: EntryFeeListService,
    private actions$: Actions) {
  }
}
