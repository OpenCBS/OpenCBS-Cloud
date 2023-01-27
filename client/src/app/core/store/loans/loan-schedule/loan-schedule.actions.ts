import { Action } from '@ngrx/store';

export const LOAD_LOAN_SCHEDULE = '[LOAN_SCHEDULE] LOAD_LOAN_SCHEDULE';
export const LOADING_LOAN_SCHEDULE = '[LOAN_SCHEDULE] LOADING_LOAN_SCHEDULE';
export const LOAD_LOAN_SCHEDULE_SUCCESS = '[LOAN_SCHEDULE] LOAD_LOAN_SCHEDULE_SUCCESS';
export const LOAD_LOAN_SCHEDULE_FAILURE = '[LOAN_SCHEDULE] LOAD_LOAN_SCHEDULE_FAILURE';
export const RESET_LOAN_SCHEDULE = '[LOAN_SCHEDULE] RESET_LOAN_SCHEDULE';
export const VALIDATE_LOAN_SCHEDULE = '[LOAN_SCHEDULE] VALIDATE_LOAN_SCHEDULE';
export const UPDATE_LOAN_SCHEDULE = '[LOAN_SCHEDULE] UPDATE_LOAN_SCHEDULE';

export class LoadLoanSchedule implements Action {
  readonly type = LOAD_LOAN_SCHEDULE;

  constructor(public payload?: any) {
  }
}

export class LoadingLoanSchedule implements Action {
  readonly type = LOADING_LOAN_SCHEDULE;

  constructor(public payload?: any) {
  }
}

export class LoadLoanScheduleSuccess implements Action {
  readonly type = LOAD_LOAN_SCHEDULE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadLoanScheduleFailure implements Action {
  readonly type = LOAD_LOAN_SCHEDULE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetLoanSchedule implements Action {
  readonly type = RESET_LOAN_SCHEDULE;

  constructor(public payload?: any) {
  }
}

export class ValidateLoanSchedule implements Action {
  readonly type = VALIDATE_LOAN_SCHEDULE;

  constructor(public payload?: any) {
  }
}

export class UpdateLoanSchedule implements Action {
  readonly type = UPDATE_LOAN_SCHEDULE;

  constructor(public payload?: any) {
  }
}

export type LoanScheduleActions =
  LoadLoanSchedule
  | LoadingLoanSchedule
  | LoadLoanScheduleSuccess
  | LoadLoanScheduleFailure
  | ResetLoanSchedule
  | ValidateLoanSchedule
  | UpdateLoanSchedule;
