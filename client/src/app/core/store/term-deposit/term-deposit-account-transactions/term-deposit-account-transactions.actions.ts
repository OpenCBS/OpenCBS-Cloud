import { Action } from '@ngrx/store';

export const LOAD_TDA_TRANSACTIONS = '[TDA_TRANSACTIONS] LOAD_TDA_TRANSACTIONS';
export const LOAD_TDA_TRANSACTIONS_SUCCESS = '[TDA_TRANSACTIONS] LOAD_TDA_TRANSACTIONS_SUCCESS';
export const LOAD_TDA_TRANSACTIONS_FAILURE = '[TDA_TRANSACTIONS] LOAD_TDA_TRANSACTIONS_FAILURE';
export const LOADING_TDA_TRANSACTIONS = '[TDA_TRANSACTIONS] LOADING_TDA_TRANSACTIONS';
export const RESET_TDA_TRANSACTIONS = '[TDA_TRANSACTIONS] RESET_TDA_TRANSACTIONS';

export class LoadTermDepositAccountTransactions implements Action {
  readonly type = LOAD_TDA_TRANSACTIONS;
  constructor(public payload?: any) {}
}
export class LoadingTermDepositAccountTransactions implements Action {
  readonly type = LOADING_TDA_TRANSACTIONS;
  constructor(public payload?: any) {}
}
export class LoadTermDepositAccountTransactionsSuccess implements Action {
  readonly type = LOAD_TDA_TRANSACTIONS_SUCCESS;
  constructor(public payload?: any) {}
}
export class LoadTermDepositAccountTransactionsFailure implements Action {
  readonly type = LOAD_TDA_TRANSACTIONS_FAILURE;
  constructor(public payload?: any) {}
}
export class ResetTermDepositAccountTransactionsReset implements Action {
  readonly type = RESET_TDA_TRANSACTIONS;
  constructor(public payload?: any) {}
}
export type TermDepositAccountTransactionsActions =
  LoadTermDepositAccountTransactions |
  LoadingTermDepositAccountTransactions |
  LoadTermDepositAccountTransactionsSuccess |
  LoadTermDepositAccountTransactionsFailure |
  ResetTermDepositAccountTransactionsReset;
