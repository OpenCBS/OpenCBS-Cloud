import { Action } from '@ngrx/store';

export const LOAD_CURRENT_ACCOUNTS = '[CURRENT_ACCOUNT_LIST] LOAD_CURRENT_ACCOUNTS';
export const LOAD_CURRENT_ACCOUNTS_SUCCESS = '[CURRENT_ACCOUNT_LIST] LOAD_CURRENT_ACCOUNTS_SUCCESS';
export const LOAD_CURRENT_ACCOUNTS_FAILURE = '[CURRENT_ACCOUNT_LIST] LOAD_CURRENT_ACCOUNTS_FAILURE';
export const LOADING_CURRENT_ACCOUNTS = '[CURRENT_ACCOUNT_LIST] LOADING_CURRENT_ACCOUNTS';

export class LoadCurrentAccounts implements Action {
  readonly type = LOAD_CURRENT_ACCOUNTS;

  constructor(public payload?: any) {
  }
}

export class LoadingCurrentAccounts implements Action {
  readonly type = LOADING_CURRENT_ACCOUNTS;

  constructor(public payload?: any) {
  }
}

export class LoadCurrentAccountsSuccess implements Action {
  readonly type = LOAD_CURRENT_ACCOUNTS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadCurrentAccountsFailure implements Action {
  readonly type = LOAD_CURRENT_ACCOUNTS_FAILURE;

  constructor(public payload?: any) {
  }
}

export type CurrentAccountListActions =
  LoadCurrentAccounts
  | LoadingCurrentAccounts
  | LoadCurrentAccountsSuccess
  | LoadCurrentAccountsFailure;
