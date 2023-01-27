import { Action } from '@ngrx/store';

export const LOAD_SAVING_PRODUCT = '[SAVING_PRODUCT] LOAD';
export const LOADING_SAVING_PRODUCT = '[SAVING_PRODUCT] LOADING';
export const LOAD_SAVING_PRODUCT_SUCCESS = '[SAVING_PRODUCT] LOAD_SUCCESS';
export const LOAD_SAVING_PRODUCT_FAILURE = '[SAVING_PRODUCT] LOAD_FAILURE';
export const RESET_SAVING_PRODUCT = '[SAVING_PRODUCT] RESET';
export const SAVING_PRODUCT_SET_BREADCRUMB = '[SAVING_PRODUCT ] SAVING_PRODUCT_SET_BREADCRUMB';

export class LoadSavingProduct implements Action {
  readonly type = LOAD_SAVING_PRODUCT;

  constructor(public payload?: any) {
  }
}

export class LoadingSavingProduct implements Action {
  readonly type = LOADING_SAVING_PRODUCT;

  constructor(public payload?: any) {
  }
}

export class LoadSavingProductSuccess implements Action {
  readonly type = LOAD_SAVING_PRODUCT_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadSavingProductFailure implements Action {
  readonly type = LOAD_SAVING_PRODUCT_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetSavingProduct implements Action {
  readonly type = RESET_SAVING_PRODUCT;

  constructor(public payload?: any) {
  }
}

export class SetSavingProductBreadcrumb implements Action {
  readonly type = SAVING_PRODUCT_SET_BREADCRUMB;

  constructor(public payload?: any) {
  }
}

export type SavingProductActions =
  LoadSavingProduct
  | LoadingSavingProduct
  | LoadSavingProductSuccess
  | LoadSavingProductFailure
  | ResetSavingProduct
  | SetSavingProductBreadcrumb;
