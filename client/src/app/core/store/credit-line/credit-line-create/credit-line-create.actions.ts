import { Action } from '@ngrx/store';

export const CREATE_CREDIT_LINE = '[CREDIT_LINE_CREATE] CREATE_CREDIT_LINE';
export const CREATE_CREDIT_LINE_LOADING = '[CREDIT_LINE_CREATE] CREATE_CREDIT_LINE_LOADING';
export const CREATE_CREDIT_LINE_SUCCESS = '[CREDIT_LINE_CREATE] CREATE_CREDIT_LINE_SUCCESS';
export const CREATE_CREDIT_LINE_FAILURE = '[CREDIT_LINE_CREATE] CREATE_CREDIT_LINE_FAILURE';
export const CREATE_CREDIT_LINE_RESET = '[CREDIT_LINE_CREATE] CREATE_CREDIT_LINE_RESET';

export class LoadCreateCreditLine implements Action {
  readonly type = CREATE_CREDIT_LINE;

  constructor(public payload?: any) {
  }
}

export class CreateCreditLineLoading implements Action {
  readonly type = CREATE_CREDIT_LINE_LOADING;

  constructor(public payload?: any) {
  }
}

export class CreateCreditLineSuccess implements Action {
  readonly type = CREATE_CREDIT_LINE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class CreateCreditLineFailure implements Action {
  readonly type = CREATE_CREDIT_LINE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class CreateCreditLineReset implements Action {
  readonly type = CREATE_CREDIT_LINE_RESET;

  constructor(public payload?: any) {
  }
}

export type CreditLineCreateActions =
  LoadCreateCreditLine
  | CreateCreditLineLoading
  | CreateCreditLineSuccess
  | CreateCreditLineFailure
  | CreateCreditLineReset;
