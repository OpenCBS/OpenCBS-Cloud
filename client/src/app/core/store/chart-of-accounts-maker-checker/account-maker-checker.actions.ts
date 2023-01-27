import { Action } from '@ngrx/store';

export const LOAD_ACCOUNT_MAKER_CHECKER = '[ACCOUNT_MAKER_CHECKER] LOAD_ACCOUNT_MAKER_CHECKER';
export const LOADING_ACCOUNT_MAKER_CHECKER = '[ACCOUNT_MAKER_CHECKER] LOADING_ACCOUNT_MAKER_CHECKER';
export const LOAD_ACCOUNT_MAKER_CHECKER_SUCCESS = '[ACCOUNT_MAKER_CHECKER] LOAD_ACCOUNT_MAKER_CHECKER_SUCCESS';
export const LOAD_ACCOUNT_MAKER_CHECKER_FAILURE = '[ACCOUNT_MAKER_CHECKER] LOAD_ACCOUNT_MAKER_CHECKER_FAILURE';
export const RESET_ACCOUNT_MAKER_CHECKER = '[ACCOUNT_MAKER_CHECKER] RESET_ACCOUNT_MAKER_CHECKER';
export const ACCOUNT_MAKER_CHECKER_SET_BREADCRUMB = '[ACCOUNT_MAKER_CHECKER ] ACCOUNT_MAKER_CHECKER_SET_BREADCRUMB';

export class LoadAccountMakerChecker implements Action {
  readonly type = LOAD_ACCOUNT_MAKER_CHECKER;

  constructor(public payload?: any) {
  }
}

export class LoadingAccountMakerChecker implements Action {
  readonly type = LOADING_ACCOUNT_MAKER_CHECKER;

  constructor(public payload?: any) {
  }
}

export class LoadAccountMakerCheckerSuccess implements Action {
  readonly type = LOAD_ACCOUNT_MAKER_CHECKER_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadAccountMakerCheckerFailure implements Action {
  readonly type = LOAD_ACCOUNT_MAKER_CHECKER_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetAccountMakerChecker implements Action {
  readonly type = RESET_ACCOUNT_MAKER_CHECKER;

  constructor(public payload?: any) {
  }
}

export class SetAccountMakerCheckerBreadcrumb implements Action {
  readonly type = ACCOUNT_MAKER_CHECKER_SET_BREADCRUMB;

  constructor(public payload?: any) {
  }
}

export type AccountMakerCheckerActions =
  LoadAccountMakerChecker |
  LoadingAccountMakerChecker |
  LoadAccountMakerCheckerSuccess |
  LoadAccountMakerCheckerFailure |
  ResetAccountMakerChecker |
  SetAccountMakerCheckerBreadcrumb;
