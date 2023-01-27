import { Action } from '@ngrx/store';

export const LOAD_ER_TRANSACTIONS = '[ER_TRANSACTIONS] LOAD_ER_TRANSACTIONS';
export const LOAD_ER_TRANSACTIONS_SUCCESS = '[ER_TRANSACTIONS] LOAD_ER_TRANSACTIONS_SUCCESS';
export const LOAD_ER_TRANSACTIONS_FAILURE = '[ER_TRANSACTIONS] LOAD_ER_TRANSACTIONS_FAILURE';
export const LOADING_ER_TRANSACTIONS = '[ER_TRANSACTIONS] LOADING_ER_TRANSACTIONS';
export const RESET_ER_TRANSACTIONS = '[ER_TRANSACTIONS] RESET_ER_TRANSACTIONS';

export class LoadExchangeRate implements Action {
  readonly type = LOAD_ER_TRANSACTIONS;

  constructor(public payload?: any) {
  }
}

export class LoadingExchangeRate implements Action {
  readonly type = LOADING_ER_TRANSACTIONS;

  constructor(public payload?: any) {
  }
}

export class LoadExchangeRateSuccess implements Action {
  readonly type = LOAD_ER_TRANSACTIONS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadExchangeRateFailure implements Action {
  readonly type = LOAD_ER_TRANSACTIONS_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetExchangeRateReset implements Action {
  readonly type = RESET_ER_TRANSACTIONS;

  constructor(public payload?: any) {
  }
}

export type ExchangeRateActions =
  LoadExchangeRate|
  LoadingExchangeRate |
  LoadExchangeRateSuccess |
  LoadExchangeRateFailure |
  ResetExchangeRateReset;
