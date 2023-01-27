import { Action } from '@ngrx/store';

export const UPDATE_LOAN_PRODUCT = '[LOAN_PRODUCT_UPDATE] UPDATE_LOAN_PRODUCT';
export const UPDATE_LOAN_PRODUCT_LOADING = '[LOAN_PRODUCT_UPDATE] UPDATE_LOAN_PRODUCT_LOADING';
export const UPDATE_LOAN_PRODUCT_SUCCESS = '[LOAN_PRODUCT_UPDATE] UPDATE_LOAN_PRODUCT_SUCCESS';
export const UPDATE_LOAN_PRODUCT_FAILURE = '[LOAN_PRODUCT_UPDATE] UPDATE_LOAN_PRODUCT_FAILURE';
export const UPDATE_LOAN_PRODUCT_RESET = '[LOAN_PRODUCT_UPDATE] UPDATE_LOAN_PRODUCT_RESET';

export class UpdateLoanProduct implements Action {
  readonly type = UPDATE_LOAN_PRODUCT;

  constructor(public payload?: any) {
  }
}

export class UpdateLoanProductLoading implements Action {
  readonly type = UPDATE_LOAN_PRODUCT_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdateLoanProductSuccess implements Action {
  readonly type = UPDATE_LOAN_PRODUCT_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateLoanProductFailure implements Action {
  readonly type = UPDATE_LOAN_PRODUCT_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateLoanProductReset implements Action {
  readonly type = UPDATE_LOAN_PRODUCT_RESET;

  constructor(public payload?: any) {
  }
}

export type LoanProductUpdateActions =
  UpdateLoanProduct
  | UpdateLoanProductLoading
  | UpdateLoanProductSuccess
  | UpdateLoanProductFailure
  | UpdateLoanProductReset;
