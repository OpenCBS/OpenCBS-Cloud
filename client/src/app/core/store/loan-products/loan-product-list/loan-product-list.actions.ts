import { Action } from '@ngrx/store';

export const LOAD_LOAN_PRODUCTS = '[LOAN_PRODUCTS] LOAD_LOAN_PRODUCTS';
export const LOADING_LOAN_PRODUCTS = '[LOAN_PRODUCTS] LOADING_LOAN_PRODUCTS';
export const LOAD_LOAN_PRODUCTS_SUCCESS = '[LOAN_PRODUCTS] LOAD_LOAN_PRODUCTS_SUCCESS';
export const LOAD_LOAN_PRODUCTS_FAILURE = '[LOAN_PRODUCTS] LOAD_LOAN_PRODUCTS_FAILURE';

export class LoadLoanProductList implements Action {
  readonly type = LOAD_LOAN_PRODUCTS;

  constructor(public payload?: any) {
  }
}

export class LoadingLoanProductList implements Action {
  readonly type = LOADING_LOAN_PRODUCTS;

  constructor(public payload?: any) {
  }
}

export class LoadLoanProductListSuccess implements Action {
  readonly type = LOAD_LOAN_PRODUCTS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadLoanProductListFail implements Action {
  readonly type = LOAD_LOAN_PRODUCTS_FAILURE;

  constructor(public payload?: any) {
  }
}

export type LoanProductListActions = LoadLoanProductList | LoadingLoanProductList | LoadLoanProductListSuccess | LoadLoanProductListFail;
