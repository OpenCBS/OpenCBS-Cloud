import { Action } from '@ngrx/store';

export const UPDATE_TRANSACTION_TEMPLATES = '[TRANSACTION_TEMPLATES_UPDATE] UPDATE';
export const UPDATE_TRANSACTION_TEMPLATES_LOADING = '[TRANSACTION_TEMPLATES_UPDATE] UPDATE_LOADING';
export const UPDATE_TRANSACTION_TEMPLATES_SUCCESS = '[TRANSACTION_TEMPLATES_UPDATE] UPDATE_SUCCESS';
export const UPDATE_TRANSACTION_TEMPLATES_FAILURE = '[TRANSACTION_TEMPLATES_UPDATE] UPDATE_FAILURE';
export const UPDATE_TRANSACTION_TEMPLATES_RESET = '[TRANSACTION_TEMPLATES_UPDATE] UPDATE_RESET';


export class UpdateTransactionTemplates implements Action {
  readonly type = UPDATE_TRANSACTION_TEMPLATES;

  constructor(public payload?: any) {
  }
}

export class UpdateTransactionTemplatesLoading implements Action {
  readonly type = UPDATE_TRANSACTION_TEMPLATES_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdateTransactionTemplatesSuccess implements Action {
  readonly type = UPDATE_TRANSACTION_TEMPLATES_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateTransactionTemplatesFailure implements Action {
  readonly type = UPDATE_TRANSACTION_TEMPLATES_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateTransactionTemplatesReset implements Action {
  readonly type = UPDATE_TRANSACTION_TEMPLATES_RESET;

  constructor(public payload?: any) {
  }
}

export type TransactionTemplatesUpdateActions =
  UpdateTransactionTemplates
  | UpdateTransactionTemplatesLoading
  | UpdateTransactionTemplatesSuccess
  | UpdateTransactionTemplatesFailure
  | UpdateTransactionTemplatesReset;
