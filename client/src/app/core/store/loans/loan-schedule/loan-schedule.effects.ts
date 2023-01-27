import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { LoanScheduleService } from './loan-schedule.service';
import * as loanScheduleActions from './loan-schedule.actions';
import { NgRxAction } from '../../action.interface';


@Injectable()
export class LoanScheduleEffects {

  @Effect()
  get_loan_schedule$ = this.actions$
    .pipe(ofType(loanScheduleActions.LOAD_LOAN_SCHEDULE),
      switchMap((action: NgRxAction) => {
        return this.loanScheduleService.getLoanSchedule(action.payload).pipe(
          map(res => {
            return new loanScheduleActions.LoadLoanScheduleSuccess(res);
          }),
          catchError(err => {
            const errObj = new loanScheduleActions.LoadLoanScheduleFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  @Effect()
  validate_loan__schedule$ = this.actions$
    .pipe(ofType(loanScheduleActions.VALIDATE_LOAN_SCHEDULE),
      switchMap((action: NgRxAction) => {
        return this.loanScheduleService.validateLoanSchedule(action.payload).pipe(
          map(res => {
            return new loanScheduleActions.LoadLoanScheduleSuccess(res);
          }),
          catchError(err => {
            const errObj = new loanScheduleActions.LoadLoanScheduleFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  @Effect()
  update_loan_schedule$ = this.actions$
    .pipe(ofType(loanScheduleActions.UPDATE_LOAN_SCHEDULE),
      switchMap((action: NgRxAction) => {
        return this.loanScheduleService.updateLoanSchedule(action.payload).pipe(
          map(res => {
            return new loanScheduleActions.LoadLoanScheduleSuccess(res);
          }),
          catchError(err => {
            const errObj = new loanScheduleActions.LoadLoanScheduleFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private loanScheduleService: LoanScheduleService,
    private actions$: Actions) {
  }
}
