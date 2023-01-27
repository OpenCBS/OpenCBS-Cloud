import { Action } from '@ngrx/store';

export const LOAD_LOAN_PRODUCT_HISTORY = '[LOAN_PRODUCT_HISTORY] LOAD_LOAN_PRODUCT_HISTORY';
export const LOADING_LOAN_PRODUCT_HISTORY = '[LOAN_PRODUCT_HISTORY] LOADING_LOAN_PRODUCT_HISTORY';
export const LOAD_LOAN_PRODUCT_HISTORY_SUCCESS = '[LOAN_PRODUCT_HISTORY] LOAD_LOAN_PRODUCT_HISTORY_SUCCESS';
export const LOAD_LOAN_PRODUCT_HISTORY_FAILURE = '[LOAN_PRODUCT_HISTORY] LOAD_LOAN_PRODUCT_HISTORY_FAILURE';
export const RESET_LOAN_PRODUCT_HISTORY = '[LOAN_PRODUCT_HISTORY] RESET_LOAN_PRODUCT_HISTORY';
export const LOAN_PRODUCT_HISTORY_SET_BREADCRUMB = '[LOAN_PRODUCT_HISTORY] LOAN_PRODUCT_HISTORY_SET_BREADCRUMB';

export class LoadLoanProductHistory implements Action {
  readonly type = LOAD_LOAN_PRODUCT_HISTORY;

  constructor(public payload?: any) {
  }
}

export class LoadingLoanProductHistory implements Action {
  readonly type = LOADING_LOAN_PRODUCT_HISTORY;

  constructor(public payload?: any) {
  }
}

export class LoadLoanProductHistorySuccess implements Action {
  readonly type = LOAD_LOAN_PRODUCT_HISTORY_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadLoanProductHistoryFailure implements Action {
  readonly type = LOAD_LOAN_PRODUCT_HISTORY_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetLoanProductHistory implements Action {
  readonly type = RESET_LOAN_PRODUCT_HISTORY;

  constructor(public payload?: any) {
  }
}

export class SetLoanProductHistoryBreadcrumb implements Action {
  readonly type = LOAN_PRODUCT_HISTORY_SET_BREADCRUMB;

  constructor(public payload?: any) {
  }
}

export type LoanProductHistoryActions =
  LoadLoanProductHistory |
  LoadingLoanProductHistory |
  LoadLoanProductHistorySuccess |
  LoadLoanProductHistoryFailure |
  ResetLoanProductHistory |
  SetLoanProductHistoryBreadcrumb;
