import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as borrowingScheduleActions from './borrowing-schedule.actions'
import { NgRxAction } from '../../action.interface';
import { BorrowingScheduleService } from './borrowing-schedule.service';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class BorrowingScheduleEffects {

  @Effect()
  get_borrowing_schedule$ = this.actions$
    .pipe(ofType(borrowingScheduleActions.LOAD_BORROWING_SCHEDULE),
      switchMap((action: NgRxAction) => {
        return this.borrowingScheduleService.getBorrowingSchedule(action.payload).pipe(
          map(res => {
            return new borrowingScheduleActions.LoadBorrowingScheduleSuccess(res);
          }),
          catchError((err: HttpErrorResponse) => {
            const errObj = new borrowingScheduleActions.LoadBorrowingScheduleFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  @Effect()
  get_active_borrowing_schedule$ = this.actions$
    .pipe(ofType(borrowingScheduleActions.LOAD_ACTIVE_BORROWING_SCHEDULE),
      switchMap((action: NgRxAction) => {
        return this.borrowingScheduleService.getActiveBorrowingSchedule(action.payload).pipe(
          map(res => {
            return new borrowingScheduleActions.LoadBorrowingScheduleSuccess(res);
          }),
          catchError((err: HttpErrorResponse) => {
            const errObj = new borrowingScheduleActions.LoadBorrowingScheduleFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private borrowingScheduleService: BorrowingScheduleService,
              private actions$: Actions) {
  }
}
