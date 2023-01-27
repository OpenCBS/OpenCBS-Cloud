import { Action } from '@ngrx/store';

export const CREATE_LOAN_PRODUCT = '[LOAN_PRODUCT_CREATE] CREATE_LOAN_PRODUCT';
export const CREATE_LOAN_PRODUCT_LOADING = '[LOAN_PRODUCT_CREATE] CREATE_LOAN_PRODUCT_LOADING';
export const CREATE_LOAN_PRODUCT_SUCCESS = '[LOAN_PRODUCT_CREATE] CREATE_LOAN_PRODUCT_SUCCESS';
export const CREATE_LOAN_PRODUCT_FAILURE = '[LOAN_PRODUCT_CREATE] CREATE_LOAN_PRODUCT_FAILURE';
export const CREATE_LOAN_PRODUCT_RESET = '[LOAN_PRODUCT_CREATE] CREATE_LOAN_PRODUCT_RESET';

export class CreateLoanProduct implements Action {
  readonly type = CREATE_LOAN_PRODUCT;

  constructor(public payload?: any) {
  }
}

export class CreateLoanProductLoading implements Action {
  readonly type = CREATE_LOAN_PRODUCT_LOADING;

  constructor(public payload?: any) {
  }
}

export class CreateLoanProductSuccess implements Action {
  readonly type = CREATE_LOAN_PRODUCT_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class CreateLoanProductFailure implements Action {
  readonly type = CREATE_LOAN_PRODUCT_FAILURE;

  constructor(public payload?: any) {
  }
}

export class CreateLoanProductReset implements Action {
  readonly type = CREATE_LOAN_PRODUCT_RESET;

  constructor(public payload?: any) {
  }
}

export type LoanProductCreateActions =
  CreateLoanProduct
  | CreateLoanProductLoading
  | CreateLoanProductSuccess
  | CreateLoanProductFailure
  | CreateLoanProductReset;
