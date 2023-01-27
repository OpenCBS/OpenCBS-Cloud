import { Action } from '@ngrx/store';

export const LOAD_LOAN_EVENTS = '[LOAD_LOAN_EVENTS] LOAD_LOAN_EVENTS';
export const LOAN_EVENTS_LOADING = '[LOAD_LOAN_EVENTS] LOAN_EVENTS_LOADING';
export const LOAN_EVENTS_SUCCESS = '[LOAD_LOAN_EVENTS] LOAN_EVENTS_SUCCESS';
export const LOAN_EVENTS_FAILURE = '[LOAD_LOAN_EVENTS] LOAN_EVENTS_FAILURE';
export const LOAN_EVENTS_RESET = '[LOAD_LOAN_EVENTS] LOAN_EVENTS_RESET';

export class LoadLoanEvents implements Action {
  readonly type = LOAD_LOAN_EVENTS;
  constructor(public payload?: any) {
  }
}

export class LoanEventsLoading implements Action {
  readonly type = LOAN_EVENTS_LOADING;

  constructor(public payload?: any) {
  }
}

export class LoanEventsSuccess implements Action {
  readonly type = LOAN_EVENTS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoanEventsFailure implements Action {
  readonly type = LOAN_EVENTS_FAILURE;

  constructor(public payload?: any) {
  }
}

export class LoanEventsReset implements Action {
  readonly type = LOAN_EVENTS_RESET;

  constructor(public payload?: any) {
  }
}

export type LoanEventsActions =
  LoadLoanEvents
  | LoanEventsLoading
  | LoanEventsSuccess
  | LoanEventsFailure
  | LoanEventsReset;
