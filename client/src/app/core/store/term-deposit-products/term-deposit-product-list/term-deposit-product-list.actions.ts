import { Action } from '@ngrx/store';

export const LOAD_TERM_DEPOSIT_PRODUCTS = '[TERM_DEPOSIT_PRODUCTS] LOAD_TERM_DEPOSIT_PRODUCTS';
export const LOADING_TERM_DEPOSIT_PRODUCTS = '[TERM_DEPOSIT_PRODUCTS] LOADING_TERM_DEPOSIT_PRODUCTS';
export const LOAD_TERM_DEPOSIT_PRODUCTS_SUCCESS = '[TERM_DEPOSIT_PRODUCTS] LOAD_TERM_DEPOSIT_PRODUCTS_SUCCESS';
export const LOAD_TERM_DEPOSIT_PRODUCTS_FAILURE = '[TERM_DEPOSIT_PRODUCTS] LOAD_TERM_DEPOSIT_PRODUCTS_FAILURE';

export class LoadTermDepositProductList implements Action {
  readonly type = LOAD_TERM_DEPOSIT_PRODUCTS;

  constructor(public payload?: any) {
  }
}

export class LoadingTermDepositProductList implements Action {
  readonly type = LOADING_TERM_DEPOSIT_PRODUCTS;

  constructor(public payload?: any) {
  }
}

export class LoadTermDepositProductListSuccess implements Action {
  readonly type = LOAD_TERM_DEPOSIT_PRODUCTS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadTermDepositProductListFail implements Action {
  readonly type = LOAD_TERM_DEPOSIT_PRODUCTS_FAILURE;

  constructor(public payload?: any) {
  }
}

export type TermDepositProductListActions =
  LoadTermDepositProductList |
  LoadingTermDepositProductList |
  LoadTermDepositProductListSuccess |
  LoadTermDepositProductListFail;
