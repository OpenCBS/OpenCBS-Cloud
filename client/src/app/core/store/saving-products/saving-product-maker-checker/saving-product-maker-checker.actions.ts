import { Action } from '@ngrx/store';

export const LOAD_SAVING_PRODUCT_MAKER_CHECKER = '[SAVING_PRODUCT_MAKER_CHECKER] LOAD';
export const LOADING_SAVING_PRODUCT_MAKER_CHECKER = '[SAVING_PRODUCT_MAKER_CHECKER] LOADING';
export const LOAD_SAVING_PRODUCT_MAKER_CHECKER_SUCCESS = '[SAVING_PRODUCT_MAKER_CHECKER] LOAD_SUCCESS';
export const LOAD_SAVING_PRODUCT_MAKER_CHECKER_FAILURE = '[SAVING_PRODUCT_MAKER_CHECKER] LOAD_FAILURE';
export const RESET_SAVING_PRODUCT_MAKER_CHECKER = '[SAVING_PRODUCT_MAKER_CHECKER] RESET';
export const SAVING_PRODUCT_MAKER_CHECKER_SET_BREADCRUMB = '[SAVING_PRODUCT_MAKER_CHECKER ] SAVING_PRODUC_MAKER_CHECKERT_SET_BREADCRUMB';

export class LoadSavingProductMakerChecker implements Action {
  readonly type = LOAD_SAVING_PRODUCT_MAKER_CHECKER;

  constructor(public payload?: any) {
  }
}

export class LoadingSavingProductMakerChecker implements Action {
  readonly type = LOADING_SAVING_PRODUCT_MAKER_CHECKER;

  constructor(public payload?: any) {
  }
}

export class LoadSavingProductMakerCheckerSuccess implements Action {
  readonly type = LOAD_SAVING_PRODUCT_MAKER_CHECKER_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadSavingProductMakerCheckerFailure implements Action {
  readonly type = LOAD_SAVING_PRODUCT_MAKER_CHECKER_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetSavingProductMakerChecker implements Action {
  readonly type = RESET_SAVING_PRODUCT_MAKER_CHECKER;

  constructor(public payload?: any) {
  }
}

export class SetSavingProductMakerCheckerBreadcrumb implements Action {
  readonly type = SAVING_PRODUCT_MAKER_CHECKER_SET_BREADCRUMB;

  constructor(public payload?: any) {
  }
}

export type SavingProductMakerCheckerActions =
  LoadSavingProductMakerChecker
  | LoadingSavingProductMakerChecker
  | LoadSavingProductMakerCheckerSuccess
  | LoadSavingProductMakerCheckerFailure
  | ResetSavingProductMakerChecker
  | SetSavingProductMakerCheckerBreadcrumb;
