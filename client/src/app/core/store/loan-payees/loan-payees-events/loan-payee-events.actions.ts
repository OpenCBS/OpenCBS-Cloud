import { Action } from '@ngrx/store';

export const LOAD_LOAN_PAYEE_EVENTS = '[LOAD_LOAN_PAYEE_EVENTS] LOAD_LOAN_PAYEE_EVENTS';
export const LOAN_PAYEE_EVENTS_LOADING = '[LOAD_LOAN_PAYEE_EVENTS] LOAN_PAYEE_EVENTS_LOADING';
export const LOAN_PAYEE_EVENTS_SUCCESS = '[LOAD_LOAN_PAYEE_EVENTS] LOAN_PAYEE_EVENTS_SUCCESS';
export const LOAN_PAYEE_EVENTS_FAILURE = '[LOAD_LOAN_PAYEE_EVENTS] LOAN_PAYEE_EVENTS_FAILURE';
export const LOAN_PAYEE_EVENTS_RESET = '[LOAD_LOAN_PAYEE_EVENTS] LOAN_PAYEE_EVENTS_RESET';

export class LoanPayeeEvents implements Action {
  readonly type = LOAD_LOAN_PAYEE_EVENTS;
  constructor(public payload?: any) {
  }
}

export class LoanPayeeEventsLoading implements Action {
  readonly type = LOAN_PAYEE_EVENTS_LOADING;

  constructor(public payload?: any) {
  }
}

export class LoanPayeeEventsSuccess implements Action {
  readonly type = LOAN_PAYEE_EVENTS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoanPayeeEventsFailure implements Action {
  readonly type = LOAN_PAYEE_EVENTS_FAILURE;

  constructor(public payload?: any) {
  }
}

export class LoanPayeeEventsReset implements Action {
  readonly type = LOAN_PAYEE_EVENTS_RESET;

  constructor(public payload?: any) {
  }
}

export type LoanPayeeEventsActions =
  LoanPayeeEvents
  | LoanPayeeEventsLoading
  | LoanPayeeEventsSuccess
  | LoanPayeeEventsFailure
  | LoanPayeeEventsReset;
