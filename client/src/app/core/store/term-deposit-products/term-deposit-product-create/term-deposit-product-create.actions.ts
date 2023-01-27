import { Action } from '@ngrx/store';

export const CREATE_TERM_DEPOSIT_PRODUCT = '[TERM_DEPOSIT_PRODUCT_CREATE] CREATE_TERM_DEPOSIT_PRODUCT';
export const CREATE_TERM_DEPOSIT_PRODUCT_LOADING = '[TERM_DEPOSIT_PRODUCT_CREATE] CREATE_TERM_DEPOSIT_PRODUCT_LOADING';
export const CREATE_TERM_DEPOSIT_PRODUCT_SUCCESS = '[TERM_DEPOSIT_PRODUCT_CREATE] CREATE_TERM_DEPOSIT_PRODUCT_SUCCESS';
export const CREATE_TERM_DEPOSIT_PRODUCT_FAILURE = '[TERM_DEPOSIT_PRODUCT_CREATE] CREATE_TERM_DEPOSIT_PRODUCT_FAILURE';
export const CREATE_TERM_DEPOSIT_PRODUCT_RESET = '[TERM_DEPOSIT_PRODUCT_CREATE] CREATE_TERM_DEPOSIT_PRODUCT_RESET';

export class CreateTermDepositProduct implements Action {
  readonly type = CREATE_TERM_DEPOSIT_PRODUCT;

  constructor(public payload?: any) {
  }
}

export class CreateTermDepositProductLoading implements Action {
  readonly type = CREATE_TERM_DEPOSIT_PRODUCT_LOADING;

  constructor(public payload?: any) {
  }
}

export class CreateTermDepositProductSuccess implements Action {
  readonly type = CREATE_TERM_DEPOSIT_PRODUCT_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class CreateTermDepositProductFailure implements Action {
  readonly type = CREATE_TERM_DEPOSIT_PRODUCT_FAILURE;

  constructor(public payload?: any) {
  }
}

export class CreateTermDepositProductReset implements Action {
  readonly type = CREATE_TERM_DEPOSIT_PRODUCT_RESET;

  constructor(public payload?: any) {
  }
}

export type TermDepositProductCreateActions =
  CreateTermDepositProduct
  | CreateTermDepositProductLoading
  | CreateTermDepositProductSuccess
  | CreateTermDepositProductFailure
  | CreateTermDepositProductReset;
