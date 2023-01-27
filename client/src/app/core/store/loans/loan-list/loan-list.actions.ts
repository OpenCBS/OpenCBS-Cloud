import { Action } from '@ngrx/store';

export const LOAD_LOANS = '[LOAN_LIST] LOAD_LOANS';
export const LOAD_LOANS_SUCCESS = '[LOAN_LIST] LOAD_LOANS_SUCCESS';
export const LOAD_LOANS_FAILURE = '[LOAN_LIST] LOAD_LOANS_FAILURE';
export const LOADING_LOANS = '[LOAN_LIST] LOADING_LOANS';

export class LoadLoanList implements Action {
  readonly type = LOAD_LOANS;

  constructor(public payload?: any) {
  }
}

export class LoadingLoanList implements Action {
  readonly type = LOADING_LOANS;

  constructor(public payload?: any) {
  }
}

export class LoadLoanListSuccess implements Action {
  readonly type = LOAD_LOANS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadLoanListFailure implements Action {
  readonly type = LOAD_LOANS_FAILURE;

  constructor(public payload?: any) {
  }
}

export type LoanListActions = LoadLoanList | LoadingLoanList | LoadLoanListSuccess | LoadLoanListFailure;
