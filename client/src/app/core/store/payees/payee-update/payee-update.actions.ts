import { Action } from '@ngrx/store';

export const UPDATE_PAYEE = '[PAYEE_UPDATE] UPDATE_PAYEE';
export const UPDATE_PAYEE_LOADING = '[PAYEE_UPDATE] UPDATE_PAYEE_LOADING';
export const UPDATE_PAYEE_SUCCESS = '[PAYEE_UPDATE] UPDATE_PAYEE_SUCCESS';
export const UPDATE_PAYEE_FAILURE = '[PAYEE_UPDATE] UPDATE_PAYEE_FAILURE';
export const UPDATE_PAYEE_RESET = '[PAYEE_UPDATE] UPDATE_PAYEE_RESET';

export class UpdatePayee implements Action {
  readonly type = UPDATE_PAYEE;

  constructor(public payload?: any) {
  }
}

export class UpdatePayeeLoading implements Action {
  readonly type = UPDATE_PAYEE_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdatePayeeSuccess implements Action {
  readonly type = UPDATE_PAYEE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdatePayeeFailure implements Action {
  readonly type = UPDATE_PAYEE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdatePayeeReset implements Action {
  readonly type = UPDATE_PAYEE_RESET;

  constructor(public payload?: any) {
  }
}


export type PayeeUpdateActions = UpdatePayee | UpdatePayeeLoading | UpdatePayeeSuccess | UpdatePayeeFailure | UpdatePayeeReset;
