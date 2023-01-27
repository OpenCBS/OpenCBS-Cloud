import { Action } from '@ngrx/store';

export const UPDATE_SAVING_PRODUCT = '[SAVING_PRODUCT_UPDATE] UPDATE';
export const UPDATE_SAVING_PRODUCT_LOADING = '[SAVING_PRODUCT_UPDATE] UPDATE_LOADING';
export const UPDATE_SAVING_PRODUCT_SUCCESS = '[SAVING_PRODUCT_UPDATE] UPDATE_SUCCESS';
export const UPDATE_SAVING_PRODUCT_FAILURE = '[SAVING_PRODUCT_UPDATE] UPDATE_FAILURE';
export const UPDATE_SAVING_PRODUCT_RESET = '[SAVING_PRODUCT_UPDATE] UPDATE_RESET';


export class UpdateSavingProduct implements Action {
  readonly type = UPDATE_SAVING_PRODUCT;

  constructor(public payload?: any) {
  }
}

export class UpdateSavingProductLoading implements Action {
  readonly type = UPDATE_SAVING_PRODUCT_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdateSavingProductSuccess implements Action {
  readonly type = UPDATE_SAVING_PRODUCT_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateSavingProductFailure implements Action {
  readonly type = UPDATE_SAVING_PRODUCT_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateSavingProductReset implements Action {
  readonly type = UPDATE_SAVING_PRODUCT_RESET;

  constructor(public payload?: any) {
  }
}

export type SavingProductUpdateActions =
  UpdateSavingProduct
  | UpdateSavingProductLoading
  | UpdateSavingProductSuccess
  | UpdateSavingProductFailure
  | UpdateSavingProductReset;
