import { Action } from '@ngrx/store';

export const CREATE_TRANSACTION_TEMPLATES = '[TRANSACTION_TEMPLATES_CREATE] CREATE';
export const CREATE_TRANSACTION_TEMPLATES_LOADING = '[TRANSACTION_TEMPLATES_CREATE] CREATE_LOADING';
export const CREATE_TRANSACTION_TEMPLATES_SUCCESS = '[TRANSACTION_TEMPLATES_CREATE] CREATE_SUCCESS';
export const CREATE_TRANSACTION_TEMPLATES_FAILURE = '[TRANSACTION_TEMPLATES_CREATE] CREATE_FAILURE';
export const CREATE_TRANSACTION_TEMPLATES_RESET = '[TRANSACTION_TEMPLATES_CREATE] CREATE_RESET';

export class CreateTransactionTemplates implements Action {
  readonly type = CREATE_TRANSACTION_TEMPLATES;

  constructor(public payload?: any) {
  }
}

export class CreateTransactionTemplatesLoading implements Action {
  readonly type = CREATE_TRANSACTION_TEMPLATES_LOADING;

  constructor(public payload?: any) {
  }
}

export class CreateTransactionTemplatesSuccess implements Action {
  readonly type = CREATE_TRANSACTION_TEMPLATES_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class CreateTransactionTemplatesFailure implements Action {
  readonly type = CREATE_TRANSACTION_TEMPLATES_FAILURE;

  constructor(public payload?: any) {
  }
}

export class CreateTransactionTemplatesReset implements Action {
  readonly type = CREATE_TRANSACTION_TEMPLATES_RESET;

  constructor(public payload?: any) {
  }
}

export type TransactionTemplatesCreateActions =
  CreateTransactionTemplates
  | CreateTransactionTemplatesLoading
  | CreateTransactionTemplatesSuccess
  | CreateTransactionTemplatesFailure
  | CreateTransactionTemplatesReset;
