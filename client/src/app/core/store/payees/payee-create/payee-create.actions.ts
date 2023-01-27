import { Action } from '@ngrx/store';

export const CREATE_PAYEE = '[PAYEE_CREATE] CREATE_PAYEE';
export const CREATE_PAYEE_LOADING = '[PAYEE_CREATE] CREATE_PAYEE_LOADING';
export const CREATE_PAYEE_SUCCESS = '[PAYEE_CREATE] CREATE_PAYEE_SUCCESS';
export const CREATE_PAYEE_FAILURE = '[PAYEE_CREATE] CREATE_PAYEE_FAILURE';
export const CREATE_PAYEE_RESET = '[PAYEE_CREATE] CREATE_PAYEE_RESET';

export class CreatePayee implements Action {
  readonly type = CREATE_PAYEE;

  constructor(public payload?: any) {
  }
}

export class CreatePayeeLoading implements Action {
  readonly type = CREATE_PAYEE_LOADING;

  constructor(public payload?: any) {
  }
}

export class CreatePayeeSuccess implements Action {
  readonly type = CREATE_PAYEE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class CreatePayeeFailure implements Action {
  readonly type = CREATE_PAYEE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class CreatePayeeReset implements Action {
  readonly type = CREATE_PAYEE_RESET;

  constructor(public payload?: any) {
  }
}

export type PayeeCreateActions = CreatePayee | CreatePayeeLoading | CreatePayeeSuccess | CreatePayeeFailure | CreatePayeeReset;
