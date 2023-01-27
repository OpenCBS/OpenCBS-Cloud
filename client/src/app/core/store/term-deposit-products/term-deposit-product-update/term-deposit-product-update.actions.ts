import { Action } from '@ngrx/store';

export const UPDATE_TERM_DEPOSIT_PRODUCT = '[TERM_DEPOSIT_PRODUCT_UPDATE] UPDATE_TERM_DEPOSIT_PRODUCT';
export const UPDATE_TERM_DEPOSIT_PRODUCT_LOADING = '[TERM_DEPOSIT_PRODUCT_UPDATE] UPDATE_TERM_DEPOSIT_PRODUCT_LOADING';
export const UPDATE_TERM_DEPOSIT_PRODUCT_SUCCESS = '[TERM_DEPOSIT_PRODUCT_UPDATE] UPDATE_TERM_DEPOSIT_PRODUCT_SUCCESS';
export const UPDATE_TERM_DEPOSIT_PRODUCT_FAILURE = '[TERM_DEPOSIT_PRODUCT_UPDATE] UPDATE_TERM_DEPOSIT_PRODUCT_FAILURE';
export const UPDATE_TERM_DEPOSIT_PRODUCT_RESET = '[TERM_DEPOSIT_PRODUCT_UPDATE] UPDATE_TERM_DEPOSIT_PRODUCT_RESET';

export class UpdateTermDepositProduct implements Action {
  readonly type = UPDATE_TERM_DEPOSIT_PRODUCT;

  constructor(public payload?: any) {
  }
}

export class UpdateTermDepositProductLoading implements Action {
  readonly type = UPDATE_TERM_DEPOSIT_PRODUCT_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdateTermDepositProductSuccess implements Action {
  readonly type = UPDATE_TERM_DEPOSIT_PRODUCT_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateTermDepositProductFailure implements Action {
  readonly type = UPDATE_TERM_DEPOSIT_PRODUCT_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateTermDepositProductReset implements Action {
  readonly type = UPDATE_TERM_DEPOSIT_PRODUCT_RESET;

  constructor(public payload?: any) {
  }
}

export type TermDepositProductUpdateActions =
  UpdateTermDepositProduct
  | UpdateTermDepositProductLoading
  | UpdateTermDepositProductSuccess
  | UpdateTermDepositProductFailure
  | UpdateTermDepositProductReset;
