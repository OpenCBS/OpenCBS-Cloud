import { Action } from '@ngrx/store';

export const LOAD_TRANSACTION_TEMPLATES_INFO = '[TRANSACTION_TEMPLATES_INFO] LOAD';
export const LOADING_TRANSACTION_TEMPLATES_INFO = '[TRANSACTION_TEMPLATES_INFO] LOADING';
export const LOAD_TRANSACTION_TEMPLATES_INFO_SUCCESS = '[TRANSACTION_TEMPLATES_INFO] LOAD_SUCCESS';
export const LOAD_TRANSACTION_TEMPLATES_INFO_FAILURE = '[TRANSACTION_TEMPLATES_INFO] LOAD_FAILURE';
export const RESET_TRANSACTION_TEMPLATES_INFO = '[TRANSACTION_TEMPLATES_INFO] RESET';
export const TRANSACTION_TEMPLATES_INFO_SET_BREADCRUMB = '[TRANSACTION_TEMPLATES_INFO ] TRANSACTION_TEMPLATES_INFO_SET_BREADCRUMB';

export class LoadTransactionTemplatesInfo implements Action {
  readonly type = LOAD_TRANSACTION_TEMPLATES_INFO;

  constructor(public payload?: any) {
  }
}

export class LoadingTransactionTemplatesInfo implements Action {
  readonly type = LOADING_TRANSACTION_TEMPLATES_INFO;

  constructor(public payload?: any) {
  }
}

export class LoadTransactionTemplatesInfoSuccess implements Action {
  readonly type = LOAD_TRANSACTION_TEMPLATES_INFO_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadTransactionTemplatesInfoFailure implements Action {
  readonly type = LOAD_TRANSACTION_TEMPLATES_INFO_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetTransactionTemplatesInfo implements Action {
  readonly type = RESET_TRANSACTION_TEMPLATES_INFO;

  constructor(public payload?: any) {
  }
}

export class SetTransactionTemplatesInfoBreadcrumb implements Action {
  readonly type = TRANSACTION_TEMPLATES_INFO_SET_BREADCRUMB;

  constructor(public payload?: any) {
  }
}

export type TransactionTemplatesInfoActions =
  LoadTransactionTemplatesInfo
  | LoadingTransactionTemplatesInfo
  | LoadTransactionTemplatesInfoSuccess
  | LoadTransactionTemplatesInfoFailure
  | ResetTransactionTemplatesInfo
  | SetTransactionTemplatesInfoBreadcrumb;
