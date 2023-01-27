import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as borrowingListActions from './borrowing-list.actions';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { BorrowingListService } from './borrowing-list.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class BorrowingListEffects {
  @Effect()
  load_borrowings$: Observable<Action> = this.actions$
    .pipe(ofType(borrowingListActions.LOAD_BORROWINGS),
      switchMap((action: NgRxAction) => {
        return this.borrowingListService.getBorrowingList(action.payload).pipe(
          map(
            res => {
              return new borrowingListActions.LoadBorrowingsSuccess(res);
            }
          ),
          catchError((err: HttpErrorResponse) => {
            const errObj = new borrowingListActions.LoadBorrowingsFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private borrowingListService: BorrowingListService,
              private actions$: Actions) {
  }
}
