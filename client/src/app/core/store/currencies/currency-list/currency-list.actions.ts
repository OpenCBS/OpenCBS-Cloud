import { Action } from '@ngrx/store';

export const LOAD_CURRENCIES = '[CURRENCIES] LOAD_CURRENCIES';
export const LOAD_CURRENCIES_SUCCESS = '[CURRENCIES] LOAD_CURRENCIES_SUCCESS';
export const LOAD_CURRENCIES_FAILURE = '[CURRENCIES] LOAD_CURRENCIES_FAILURE';
export const LOADING_CURRENCIES = '[CURRENCIES] LOADING_CURRENCIES';
export const RESET_CURRENCIES = '[CURRENCIES] RESET_CURRENCIES';

export class LoadCurrencies implements Action {
  readonly type = LOAD_CURRENCIES;
}

export class LoadingCurrencies implements Action {
  readonly type = LOADING_CURRENCIES;
}

export class LoadCurrenciesSuccess implements Action {
  readonly type = LOAD_CURRENCIES_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadCurrenciesFailure implements Action {
  readonly type = LOAD_CURRENCIES_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetCurrencies implements Action {
  readonly type = RESET_CURRENCIES;
}

export type CurrencyListActions = LoadCurrencies | LoadingCurrencies | LoadCurrenciesSuccess | LoadCurrenciesFailure | ResetCurrencies;
