import { Action } from '@ngrx/store';

export const LOAD_ROLE_MAKER_CHECKER = '[ROLE_MAKER_CHECKER] LOAD_ROLE_MAKER_CHECKER';
export const LOADING_ROLE_MAKER_CHECKER = '[ROLE_MAKER_CHECKER] LOADING_ROLE_MAKER_CHECKER';
export const LOAD_ROLE_MAKER_CHECKER_SUCCESS = '[ROLE_MAKER_CHECKER] LOAD_ROLE_MAKER_CHECKER_SUCCESS';
export const LOAD_ROLE_MAKER_CHECKER_FAILURE = '[ROLE_MAKER_CHECKER] LOAD_ROLE_MAKER_CHECKER_FAILURE';
export const RESET_ROLE_MAKER_CHECKER = '[ROLE_MAKER_CHECKER] RESET_ROLE_MAKER_CHECKER';
export const ROLE_MAKER_CHECKER_SET_BREADCRUMB = '[ROLE_MAKER_CHECKER ] ROLE_MAKER_CHECKER_SET_BREADCRUMB';

export class LoadRoleMakerChecker implements Action {
  readonly type = LOAD_ROLE_MAKER_CHECKER;

  constructor(public payload?: any) {
  }
}

export class LoadingRoleMakerChecker implements Action {
  readonly type = LOADING_ROLE_MAKER_CHECKER;

  constructor(public payload?: any) {
  }
}

export class LoadRoleMakerCheckerSuccess implements Action {
  readonly type = LOAD_ROLE_MAKER_CHECKER_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadRoleMakerCheckerFailure implements Action {
  readonly type = LOAD_ROLE_MAKER_CHECKER_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetRoleMakerChecker implements Action {
  readonly type = RESET_ROLE_MAKER_CHECKER;

  constructor(public payload?: any) {
  }
}

export class SetRoleMakerCheckerBreadcrumb implements Action {
  readonly type = ROLE_MAKER_CHECKER_SET_BREADCRUMB;

  constructor(public payload?: any) {
  }
}

export type RoleMakerCheckerActions =
  LoadRoleMakerChecker |
  LoadingRoleMakerChecker |
  LoadRoleMakerCheckerSuccess |
  LoadRoleMakerCheckerFailure |
  ResetRoleMakerChecker |
  SetRoleMakerCheckerBreadcrumb;
