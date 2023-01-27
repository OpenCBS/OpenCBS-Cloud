import { Action } from '@ngrx/store';

export const LOAD_CREDIT_LINE = '[CREDIT_LINE] LOAD_CREDIT_LINE';
export const LOAD_CREDIT_LINE_SUCCESS = '[CREDIT_LINE] LOAD_CREDIT_LINE_SUCCESS';
export const LOAD_CREDIT_LINE_FAILURE = '[CREDIT_LINE] LOAD_CREDIT_LINE_FAILURE';
export const LOADING_CREDIT_LINE = '[CREDIT_LINE] LOADING_CREDIT_LINE';

export class LoadCreditLine implements Action {
  readonly type = LOAD_CREDIT_LINE;

  constructor(public payload?: any) {
  }
}

export class LoadingCreditLine implements Action {
  readonly type = LOADING_CREDIT_LINE;

  constructor(public payload?: any) {
  }
}

export class LoadCreditLineSuccess implements Action {
  readonly type = LOAD_CREDIT_LINE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadCreditLineFailure implements Action {
  readonly type = LOAD_CREDIT_LINE_FAILURE;

  constructor(public payload?: any) {
  }
}

export type CreditLineActions =
  LoadCreditLine
  | LoadingCreditLine
  | LoadCreditLineSuccess
  | LoadCreditLineFailure;
