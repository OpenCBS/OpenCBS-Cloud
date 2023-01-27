import { Action } from '@ngrx/store';

export const LOAD_LOAN_PRODUCT_MAKER_CHECKER = '[LOAN_PRODUCT_MAKER_CHECKER] LOAD_LOAN_PRODUCT_MAKER_CHECKER';
export const LOADING_LOAN_PRODUCT_MAKER_CHECKER = '[LOAN_PRODUCT_MAKER_CHECKER] LOADING_LOAN_PRODUCT_MAKER_CHECKER';
export const LOAD_LOAN_PRODUCT_MAKER_CHECKER_SUCCESS = '[LOAN_PRODUCT_MAKER_CHECKER] LOAD_LOAN_PRODUCT_MAKER_CHECKER_SUCCESS';
export const LOAD_LOAN_PRODUCT_MAKER_CHECKER_FAILURE = '[LOAN_PRODUCT_MAKER_CHECKER] LOAD_LOAN_PRODUCT_MAKER_CHECKER_FAILURE';
export const RESET_LOAN_PRODUCT_MAKER_CHECKER = '[LOAN_PRODUCT_MAKER_CHECKER] RESET_LOAN_PRODUCT_MAKER_CHECKER';
export const LOAN_PRODUCT_MAKER_CHECKER_SET_BREADCRUMB = '[LOAN_PRODUCT_MAKER_CHECKER ] LOAN_PRODUCT_MAKER_CHECKER_SET_BREADCRUMB';

export class LoadLoanProductMakerChecker implements Action {
  readonly type = LOAD_LOAN_PRODUCT_MAKER_CHECKER;

  constructor(public payload?: any) {
  }
}

export class LoadingLoanProductMakerChecker implements Action {
  readonly type = LOADING_LOAN_PRODUCT_MAKER_CHECKER;

  constructor(public payload?: any) {
  }
}

export class LoadLoanProductMakerCheckerSuccess implements Action {
  readonly type = LOAD_LOAN_PRODUCT_MAKER_CHECKER_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadLoanProductMakerCheckerFailure implements Action {
  readonly type = LOAD_LOAN_PRODUCT_MAKER_CHECKER_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetLoanProductMakerChecker implements Action {
  readonly type = RESET_LOAN_PRODUCT_MAKER_CHECKER;

  constructor(public payload?: any) {
  }
}

export class SetLoanProductMakerCheckerBreadcrumb implements Action {
  readonly type = LOAN_PRODUCT_MAKER_CHECKER_SET_BREADCRUMB;

  constructor(public payload?: any) {
  }
}

export type LoanProductMakerCheckerActions =
  LoadLoanProductMakerChecker |
  LoadingLoanProductMakerChecker |
  LoadLoanProductMakerCheckerSuccess |
  LoadLoanProductMakerCheckerFailure |
  ResetLoanProductMakerChecker |
  SetLoanProductMakerCheckerBreadcrumb;
