import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { Action } from '@ngrx/store';


import * as borrowingCreateActions from './borrowing-create.actions';
import { NgRxAction } from '../../action.interface';
import { BorrowingCreateService } from './borrowing-create.service';

@Injectable()
export class BorrowingCreateEffect {
  @Effect()
  create_borrowing$ = this.actions$
    .pipe(ofType(borrowingCreateActions.CREATE_BORROWING),
      switchMap((action: NgRxAction) => {
        return this.borrowingCreateService.addBorrowing(action.payload).pipe(
          map(res => new borrowingCreateActions.CreateBorrowingSuccess(res)),
          catchError((err): Observable<Action> => {
            const errObj = new borrowingCreateActions.CreateBorrowingFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private borrowingCreateService: BorrowingCreateService,
              private actions$: Actions) {

  }
}
