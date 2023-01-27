import { Action } from '@ngrx/store';

export const LOAD_LOAN_APP_SCHEDULE = '[LOAN_APP_SCHEDULE] LOAD_LOAN_APP_SCHEDULE';
export const LOADING_LOAN_APP_SCHEDULE = '[LOAN_APP_SCHEDULE] LOADING_LOAN_APP_SCHEDULE';
export const LOAD_LOAN_APP_SCHEDULE_SUCCESS = '[LOAN_APP_SCHEDULE] LOAD_LOAN_APP_SCHEDULE_SUCCESS';
export const LOAD_LOAN_APP_SCHEDULE_FAILURE = '[LOAN_APP_SCHEDULE] LOAD_LOAN_APP_SCHEDULE_FAILURE';
export const RESET_LOAN_APP_SCHEDULE = '[LOAN_APP_SCHEDULE] RESET_LOAN_APP_SCHEDULE';
export const VALIDATE_LOAN_APP_SCHEDULE = '[LOAN_APP_SCHEDULE] VALIDATE_LOAN_APP_SCHEDULE';
export const UPDATE_LOAN_APP_SCHEDULE = '[LOAN_APP_SCHEDULE] UPDATE_LOAN_APP_SCHEDULE';

export class LoadLoanAppSchedule implements Action {
  readonly type = LOAD_LOAN_APP_SCHEDULE;

  constructor(public payload?: any) {
  }
}

export class LoadingLoanAppSchedule implements Action {
  readonly type = LOADING_LOAN_APP_SCHEDULE;

  constructor(public payload?: any) {
  }
}

export class LoadLoanAppScheduleSuccess implements Action {
  readonly type = LOAD_LOAN_APP_SCHEDULE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadLoanAppScheduleFailure implements Action {
  readonly type = LOAD_LOAN_APP_SCHEDULE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetLoanAppSchedule implements Action {
  readonly type = RESET_LOAN_APP_SCHEDULE;
}

export class ValidateLoanAppSchedule implements Action {
  readonly type = VALIDATE_LOAN_APP_SCHEDULE;

  constructor(public payload?: any) {
  }
}

export class UpdateLoanAppSchedule implements Action {
  readonly type = UPDATE_LOAN_APP_SCHEDULE;

  constructor(public payload?: any) {
  }
}

export type LoanAppScheduleActions =
  LoadLoanAppSchedule
  | LoadingLoanAppSchedule
  | LoadLoanAppScheduleSuccess
  | LoadLoanAppScheduleFailure
  | ResetLoanAppSchedule
  | ValidateLoanAppSchedule
  | UpdateLoanAppSchedule;
