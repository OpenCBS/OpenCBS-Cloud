import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as borrowingUpdateActions from './borrowing-update.actions';
import { BorrowingUpdateService } from './borrowing-update.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class BorrowingUpdateEffects {

  @Effect()
  update_borrowing$ = this.actions$
    .pipe(ofType(borrowingUpdateActions.UPDATE_BORROWING),
      switchMap((action: NgRxAction) => {
        return this.borrowingUpdateService.updateBorrowing(action.payload.data, action.payload.borrowingId).pipe(
          map(
            res => new borrowingUpdateActions.UpdateBorrowingSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new borrowingUpdateActions.UpdateBorrowingFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private borrowingUpdateService: BorrowingUpdateService,
              private actions$: Actions) {
  }
}
