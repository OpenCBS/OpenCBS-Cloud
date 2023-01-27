import { Action } from '@ngrx/store';

export const LOAD_LOAN_INFO = '[LOAN_INFO] LOAD_LOAN_INFO';
export const LOADING_LOAN_INFO = '[LOAN_INFO] LOADING_LOAN_INFO';
export const LOAD_LOAN_INFO_SUCCESS = '[LOAN_INFO] LOAD_LOAN_INFO_SUCCESS';
export const LOAD_LOAN_INFO_FAILURE = '[LOAN_INFO] LOAD_LOAN_INFO_FAILURE';
export const RESET_LOAN_INFO = '[LOAN_INFO] RESET_LOAN_INFO';
export const LOAN_SET_BREADCRUMB = '[LOAN_INFO] LOAN_SET_BREADCRUMB';

export class LoadLoanInfo implements Action {
  readonly type = LOAD_LOAN_INFO;

  constructor(public payload?: any) {
  }
}

export class LoadingLoanInfo implements Action {
  readonly type = LOADING_LOAN_INFO;

  constructor(public payload?: any) {
  }
}

export class LoadLoanInfoSuccess implements Action {
  readonly type = LOAD_LOAN_INFO_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadLoanInfoFailure implements Action {
  readonly type = LOAD_LOAN_INFO_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetLoanInfo implements Action {
  readonly type = RESET_LOAN_INFO;

  constructor(public payload?: any) {
  }
}

export class SetLoanBreadcrumb implements Action {
  readonly type = LOAN_SET_BREADCRUMB;

  constructor(public payload?: any) {
  }
}

export type LoanInfoActions =
  LoadLoanInfo
  | LoadingLoanInfo
  | LoadLoanInfoSuccess
  | LoadLoanInfoFailure
  | ResetLoanInfo
  | SetLoanBreadcrumb;
