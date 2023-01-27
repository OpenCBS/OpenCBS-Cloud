import { Action } from '@ngrx/store';

export const LOAD_TERM_DEPOSIT_PRODUCT_MAKER_CHECKER = '[TERM_DEPOSIT_PRODUCT_MAKER_CHECKER] LOAD_TERM_DEPOSIT_PRODUCT_MAKER_CHECKER';
export const LOADING_TERM_DEPOSIT_PRODUCT_MAKER_CHECKER = '[TERM_DEPOSIT_PRODUCT_MAKER_CHECKER] LOADING_TERM_DEPOSIT_PRODUCT_MAKER_CHECKER';
export const LOAD_TERM_DEPOSIT_PRODUCT_MAKER_CHECKER_SUCCESS = '[TERM_DEPOSIT_PRODUCT_MAKER_CHECKER] LOAD_TERM_DEPOSIT_PRODUCT_MAKER_CHECKER_SUCCESS';
export const LOAD_TERM_DEPOSIT_PRODUCT_MAKER_CHECKER_FAILURE = '[TERM_DEPOSIT_PRODUCT_MAKER_CHECKER] LOAD_TERM_DEPOSIT_PRODUCT_MAKER_CHECKER_FAILURE';
export const RESET_TERM_DEPOSIT_PRODUCT_MAKER_CHECKER = '[TERM_DEPOSIT_PRODUCT_MAKER_CHECKER] RESET_TERM_DEPOSIT_PRODUCT_MAKER_CHECKER';
export const TERM_DEPOSIT_PRODUCT_MAKER_CHECKER_SET_BREADCRUMB = '[TERM_DEPOSIT_PRODUCT_MAKER_CHECKER ] TERM_DEPOSIT_PRODUCT_MAKER_CHECKER_SET_BREADCRUMB';

export class LoadTermDepositProductMakerChecker implements Action {
  readonly type = LOAD_TERM_DEPOSIT_PRODUCT_MAKER_CHECKER;

  constructor(public payload?: any) {
  }
}

export class LoadingTermDepositProductMakerChecker implements Action {
  readonly type = LOADING_TERM_DEPOSIT_PRODUCT_MAKER_CHECKER;

  constructor(public payload?: any) {
  }
}

export class LoadTermDepositProductMakerCheckerSuccess implements Action {
  readonly type = LOAD_TERM_DEPOSIT_PRODUCT_MAKER_CHECKER_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadTermDepositProductMakerCheckerFailure implements Action {
  readonly type = LOAD_TERM_DEPOSIT_PRODUCT_MAKER_CHECKER_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetTermDepositProductMakerChecker implements Action {
  readonly type = RESET_TERM_DEPOSIT_PRODUCT_MAKER_CHECKER;

  constructor(public payload?: any) {
  }
}

export class SetTermDepositProductMakerCheckerBreadcrumb implements Action {
  readonly type = TERM_DEPOSIT_PRODUCT_MAKER_CHECKER_SET_BREADCRUMB;

  constructor(public payload?: any) {
  }
}

export type TermDepositProductMakerCheckerActions =
  LoadTermDepositProductMakerChecker |
  LoadingTermDepositProductMakerChecker |
  LoadTermDepositProductMakerCheckerSuccess |
  LoadTermDepositProductMakerCheckerFailure |
  ResetTermDepositProductMakerChecker |
  SetTermDepositProductMakerCheckerBreadcrumb;
