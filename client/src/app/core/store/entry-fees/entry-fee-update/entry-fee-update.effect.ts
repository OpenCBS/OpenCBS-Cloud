import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { EntryFeeUpdateService } from './entry-fee-update.service';
import * as entryFeeUpdateActions from './entry-fee-update.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class EntryFeeUpdateEffects {

  @Effect()
  update_entryFee$ = this.actions$
    .pipe(ofType(entryFeeUpdateActions.UPDATE_ENTRY_FEE),
      switchMap((action: NgRxAction) => {
        return this.entryFeeUpdateService.updateEntryFee(action.payload.data, action.payload.entryFeeId).pipe(
          map(
            res => new entryFeeUpdateActions.UpdateEntryFeeSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new entryFeeUpdateActions.UpdateEntryFeeFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private entryFeeUpdateService: EntryFeeUpdateService,
              private actions$: Actions) {
  }
}
