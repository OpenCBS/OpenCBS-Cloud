import { Action } from '@ngrx/store';

export const LOAD_SAVING_PRODUCTS = '[SAVING_PRODUCTS] LOAD';
export const LOADING_SAVING_PRODUCTS = '[SAVING_PRODUCTS] LOADING';
export const LOAD_SAVING_PRODUCTS_SUCCESS = '[SAVING_PRODUCTS] LOAD_SUCCESS';
export const LOAD_SAVING_PRODUCTS_FAILURE = '[SAVING_PRODUCTS] LOAD_FAILURE';

export class LoadSavingProductList implements Action {
  readonly type = LOAD_SAVING_PRODUCTS;

  constructor(public payload?: any) {
  }
}

export class LoadingSavingProductList implements Action {
  readonly type = LOADING_SAVING_PRODUCTS;

  constructor(public payload?: any) {
  }
}

export class LoadSavingProductListSuccess implements Action {
  readonly type = LOAD_SAVING_PRODUCTS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadSavingProductListFail implements Action {
  readonly type = LOAD_SAVING_PRODUCTS_FAILURE;

  constructor(public payload?: any) {
  }
}

export type SavingProductListActions =
  LoadSavingProductList
  | LoadingSavingProductList
  | LoadSavingProductListSuccess
  | LoadSavingProductListFail;
