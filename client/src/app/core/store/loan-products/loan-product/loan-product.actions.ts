import { Action } from '@ngrx/store';

export const LOAD_LOAN_PRODUCT = '[LOAN_PRODUCT] LOAD_LOAN_PRODUCT';
export const LOADING_LOAN_PRODUCT = '[LOAN_PRODUCT] LOADING_LOAN_PRODUCT';
export const LOAD_LOAN_PRODUCT_SUCCESS = '[LOAN_PRODUCT] LOAD_LOAN_PRODUCT_SUCCESS';
export const LOAD_LOAN_PRODUCT_FAILURE = '[LOAN_PRODUCT] LOAD_LOAN_PRODUCT_FAILURE';
export const RESET_LOAN_PRODUCT = '[LOAN_PRODUCT] RESET_LOAN_PRODUCT';
export const LOAN_PRODUCT_SET_BREADCRUMB = '[LOAN_PRODUCT ] LOAN_PRODUCT_SET_BREADCRUMB';

export class LoadLoanProduct implements Action {
  readonly type = LOAD_LOAN_PRODUCT;

  constructor(public payload?: any) {
  }
}

export class LoadingLoanProduct implements Action {
  readonly type = LOADING_LOAN_PRODUCT;

  constructor(public payload?: any) {
  }
}

export class LoadLoanProductSuccess implements Action {
  readonly type = LOAD_LOAN_PRODUCT_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadLoanProductFailure implements Action {
  readonly type = LOAD_LOAN_PRODUCT_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetLoanProduct implements Action {
  readonly type = RESET_LOAN_PRODUCT;

  constructor(public payload?: any) {
  }
}

export class SetLoanProductBreadcrumb implements Action {
  readonly type = LOAN_PRODUCT_SET_BREADCRUMB;

  constructor(public payload?: any) {
  }
}

export type LoanProductActions =
  LoadLoanProduct |
  LoadingLoanProduct |
  LoadLoanProductSuccess |
  LoadLoanProductFailure |
  ResetLoanProduct |
  SetLoanProductBreadcrumb;
