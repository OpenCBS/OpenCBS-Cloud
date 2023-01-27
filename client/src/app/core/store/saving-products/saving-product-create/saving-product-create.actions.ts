import { Action } from '@ngrx/store';

export const CREATE_SAVING_PRODUCT = '[SAVING_PRODUCT_CREATE] CREATE';
export const CREATE_SAVING_PRODUCT_LOADING = '[SAVING_PRODUCT_CREATE] CREATE_LOADING';
export const CREATE_SAVING_PRODUCT_SUCCESS = '[SAVING_PRODUCT_CREATE] CREATE_SUCCESS';
export const CREATE_SAVING_PRODUCT_FAILURE = '[SAVING_PRODUCT_CREATE] CREATE_FAILURE';
export const CREATE_SAVING_PRODUCT_RESET = '[SAVING_PRODUCT_CREATE] CREATE_RESET';

export class CreateSavingProduct implements Action {
  readonly type = CREATE_SAVING_PRODUCT;

  constructor(public payload?: any) {
  }
}

export class CreateSavingProductLoading implements Action {
  readonly type = CREATE_SAVING_PRODUCT_LOADING;

  constructor(public payload?: any) {
  }
}

export class CreateSavingProductSuccess implements Action {
  readonly type = CREATE_SAVING_PRODUCT_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class CreateSavingProductFailure implements Action {
  readonly type = CREATE_SAVING_PRODUCT_FAILURE;

  constructor(public payload?: any) {
  }
}

export class CreateSavingProductReset implements Action {
  readonly type = CREATE_SAVING_PRODUCT_RESET;

  constructor(public payload?: any) {
  }
}

export type SavingProductCreateActions =
  CreateSavingProduct
  | CreateSavingProductLoading
  | CreateSavingProductSuccess
  | CreateSavingProductFailure
  | CreateSavingProductReset;
