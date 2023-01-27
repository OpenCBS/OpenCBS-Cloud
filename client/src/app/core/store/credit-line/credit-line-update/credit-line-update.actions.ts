import { Action } from '@ngrx/store';

export const UPDATE_CREDIT_LINE = '[CREDIT_LINE_UPDATE] UPDATE_CREDIT_LINE';
export const UPDATE_CREDIT_LINE_LOADING = '[CREDIT_LINE_UPDATE] UPDATE_CREDIT_LINE_LOADING';
export const UPDATE_CREDIT_LINE_SUCCESS = '[CREDIT_LINE_UPDATE] UPDATE_CREDIT_LINE_SUCCESS';
export const UPDATE_CREDIT_LINE_FAILURE = '[CREDIT_LINE_UPDATE] UPDATE_CREDIT_LINE_FAILURE';
export const UPDATE_CREDIT_LINE_RESET = '[CREDIT_LINE_UPDATE] UPDATE_CREDIT_LINE_RESET';

export class UpdateCreditLine implements Action {
  readonly type = UPDATE_CREDIT_LINE;

  constructor(public payload?: any) {
  }
}

export class UpdateCreditLineLoading implements Action {
  readonly type = UPDATE_CREDIT_LINE_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdateCreditLineSuccess implements Action {
  readonly type = UPDATE_CREDIT_LINE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateCreditLineFailure implements Action {
  readonly type = UPDATE_CREDIT_LINE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateCreditLineReset implements Action {
  readonly type = UPDATE_CREDIT_LINE_RESET;

  constructor(public payload?: any) {
  }
}

export type CreditLineUpdateActions =
  UpdateCreditLine
  | UpdateCreditLineLoading
  | UpdateCreditLineSuccess
  | UpdateCreditLineFailure
  | UpdateCreditLineReset;
