import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { LoanAppScheduleService } from './loan-application-schedule.service';
import * as loanAppScheduleActions from './loan-application-schedule.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class LoanAppScheduleEffects {

  @Effect()
  get_loan_app_schedule$ = this.actions$
    .pipe(ofType(loanAppScheduleActions.LOAD_LOAN_APP_SCHEDULE),
      switchMap((action: NgRxAction) => {
        return this.loanAppScheduleService.getLoanAppSchedule(action.payload).pipe(
          map(res => {
            return new loanAppScheduleActions.LoadLoanAppScheduleSuccess(res);
          }),
          catchError((err: HttpErrorResponse) => {
            const errObj = new loanAppScheduleActions.LoadLoanAppScheduleFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  @Effect()
  validate_loan_app_schedule$ = this.actions$
    .pipe(ofType(loanAppScheduleActions.VALIDATE_LOAN_APP_SCHEDULE),
      switchMap((action: NgRxAction) => {
        return this.loanAppScheduleService.validateLoanAppSchedule(action.payload).pipe(
          map(res => {
            return new loanAppScheduleActions.LoadLoanAppScheduleSuccess(res);
          }),
          catchError(err => {
            const errObj = new loanAppScheduleActions.LoadLoanAppScheduleFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  @Effect()
  update_loan_app_schedule$ = this.actions$
    .pipe(ofType(loanAppScheduleActions.UPDATE_LOAN_APP_SCHEDULE),
      switchMap((action: NgRxAction) => {
        return this.loanAppScheduleService.updateLoanAppSchedule(action.payload).pipe(
          map(res => {
            return new loanAppScheduleActions.LoadLoanAppScheduleSuccess(res);
          }),
          catchError(err => {
            const errObj = new loanAppScheduleActions.LoadLoanAppScheduleFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private loanAppScheduleService: LoanAppScheduleService,
    private actions$: Actions) {
  }
}
