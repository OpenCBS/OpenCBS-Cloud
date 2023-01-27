import { Action } from '@ngrx/store';

export const LOAD_CA_TRANSACTIONS = '[CA_TRANSACTIONS] LOAD_CA_TRANSACTIONS';
export const LOAD_CA_TRANSACTIONS_SUCCESS = '[CA_TRANSACTIONS] LOAD_CA_TRANSACTIONS_SUCCESS';
export const LOAD_CA_TRANSACTIONS_FAILURE = '[CA_TRANSACTIONS] LOAD_CA_TRANSACTIONS_FAILURE';
export const LOADING_CA_TRANSACTIONS = '[CA_TRANSACTIONS] LOADING_CA_TRANSACTIONS';
export const RESET_CA_TRANSACTIONS = '[CA_TRANSACTIONS] RESET_CA_TRANSACTIONS';

export class LoadCurrentAccountTransactions implements Action {
  readonly type = LOAD_CA_TRANSACTIONS;

  constructor(public payload?: any) {
  }
}

export class LoadingCurrentAccountTransactions implements Action {
  readonly type = LOADING_CA_TRANSACTIONS;

  constructor(public payload?: any) {
  }
}

export class LoadCurrentAccountTransactionsSuccess implements Action {
  readonly type = LOAD_CA_TRANSACTIONS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadCurrentAccountTransactionsFailure implements Action {
  readonly type = LOAD_CA_TRANSACTIONS_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetCurrentAccountTransactionsReset implements Action {
  readonly type = RESET_CA_TRANSACTIONS;

  constructor(public payload?: any) {
  }
}

export type CurrentAccountTransactionsActions =
  LoadCurrentAccountTransactions
  | LoadingCurrentAccountTransactions
  | LoadCurrentAccountTransactionsSuccess
  | LoadCurrentAccountTransactionsFailure
  | ResetCurrentAccountTransactionsReset;
