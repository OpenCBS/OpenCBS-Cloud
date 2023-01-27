import { Action } from '@ngrx/store';

export const LOAD_TRANSACTION_TEMPLATES_LIST = '[TRANSACTION_TEMPLATES_LIST] LOAD';
export const LOADING_TRANSACTION_TEMPLATES_LIST = '[TRANSACTION_TEMPLATES_LIST] LOADING';
export const LOAD_TRANSACTION_TEMPLATES_LIST_SUCCESS = '[TRANSACTION_TEMPLATES_LIST] LOAD_SUCCESS';
export const LOAD_TRANSACTION_TEMPLATES_LIST_FAILURE = '[TRANSACTION_TEMPLATES_LIST] LOAD_FAILURE';

export class LoadTransactionTemplatesList implements Action {
  readonly type = LOAD_TRANSACTION_TEMPLATES_LIST;

  constructor(public payload?: any) {
  }
}

export class LoadingTransactionTemplatesList implements Action {
  readonly type = LOADING_TRANSACTION_TEMPLATES_LIST;

  constructor(public payload?: any) {
  }
}

export class LoadTransactionTemplatesListSuccess implements Action {
  readonly type = LOAD_TRANSACTION_TEMPLATES_LIST_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadTransactionTemplatesListFail implements Action {
  readonly type = LOAD_TRANSACTION_TEMPLATES_LIST_FAILURE;

  constructor(public payload?: any) {
  }
}

export type TransactionTemplatesListActions =
  LoadTransactionTemplatesList
  | LoadingTransactionTemplatesList
  | LoadTransactionTemplatesListSuccess
  | LoadTransactionTemplatesListFail;
