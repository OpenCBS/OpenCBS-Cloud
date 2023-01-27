import { Action } from '@ngrx/store';

export const LOAD_TERM_DEPOSIT_PRODUCT = '[TERM_DEPOSIT_PRODUCT] LOAD_TERM_DEPOSIT_PRODUCT';
export const LOADING_TERM_DEPOSIT_PRODUCT = '[TERM_DEPOSIT_PRODUCT] LOADING_TERM_DEPOSIT_PRODUCT';
export const LOAD_TERM_DEPOSIT_PRODUCT_SUCCESS = '[TERM_DEPOSIT_PRODUCT] LOAD_TERM_DEPOSIT_PRODUCT_SUCCESS';
export const LOAD_TERM_DEPOSIT_PRODUCT_FAILURE = '[TERM_DEPOSIT_PRODUCT] LOAD_TERM_DEPOSIT_PRODUCT_FAILURE';
export const RESET_TERM_DEPOSIT_PRODUCT = '[TERM_DEPOSIT_PRODUCT] RESET_TERM_DEPOSIT_PRODUCT';
export const TERM_DEPOSIT_PRODUCT_SET_BREADCRUMB = '[TERM_DEPOSIT_PRODUCT ] TERM_DEPOSIT_PRODUCT_SET_BREADCRUMB';

export class LoadTermDepositProduct implements Action {
  readonly type = LOAD_TERM_DEPOSIT_PRODUCT;

  constructor(public payload?: any) {
  }
}

export class LoadingTermDepositProduct implements Action {
  readonly type = LOADING_TERM_DEPOSIT_PRODUCT;

  constructor(public payload?: any) {
  }
}

export class LoadTermDepositProductSuccess implements Action {
  readonly type = LOAD_TERM_DEPOSIT_PRODUCT_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadTermDepositProductFailure implements Action {
  readonly type = LOAD_TERM_DEPOSIT_PRODUCT_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetTermDepositProduct implements Action {
  readonly type = RESET_TERM_DEPOSIT_PRODUCT;

  constructor(public payload?: any) {
  }
}

export class SetTermDepositProductBreadcrumb implements Action {
  readonly type = TERM_DEPOSIT_PRODUCT_SET_BREADCRUMB;

  constructor(public payload?: any) {
  }
}

export type TermDepositProductInfoActions =
  LoadTermDepositProduct |
  LoadingTermDepositProduct |
  LoadTermDepositProductSuccess |
  LoadTermDepositProductFailure |
  ResetTermDepositProduct |
  SetTermDepositProductBreadcrumb;
