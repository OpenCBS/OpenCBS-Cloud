import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { EntryFeeCreateService } from './entry-fee-create.service';
import * as entryFeeCreateActions from './entry-fee-create.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class EntryFeeCreateEffects {

  @Effect()
  create_entryFee$ = this.actions$
    .pipe(ofType(entryFeeCreateActions.CREATE_ENTRY_FEE),
      switchMap((action: NgRxAction) => {
        return this.entryFeeCreateService.createEntryFee(action.payload).pipe(
          map(
            res => new entryFeeCreateActions.CreateEntryFeeSuccess()),
          catchError((err: HttpErrorResponse) => {
            const errObj = new entryFeeCreateActions.CreateEntryFeeFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private entryFeeCreateService: EntryFeeCreateService,
              private actions$: Actions) {
  }
}
