import { Action } from '@ngrx/store';

export const LOAD_USER_MAKER_CHECKER = '[USER_MAKER_CHECKER] LOAD_USER_MAKER_CHECKER';
export const LOADING_USER_MAKER_CHECKER = '[USER_MAKER_CHECKER] LOADING_USER_MAKER_CHECKER';
export const LOAD_USER_MAKER_CHECKER_SUCCESS = '[USER_MAKER_CHECKER] LOAD_USER_MAKER_CHECKER_SUCCESS';
export const LOAD_USER_MAKER_CHECKER_FAILURE = '[USER_MAKER_CHECKER] LOAD_USER_MAKER_CHECKER_FAILURE';
export const RESET_USER_MAKER_CHECKER = '[USER_MAKER_CHECKER] RESET_USER_MAKER_CHECKER';
export const USER_MAKER_CHECKER_SET_BREADCRUMB = '[USER_MAKER_CHECKER] USER_MAKER_CHECKER_SET_BREADCRUMB';

export class LoadUserMakerChecker implements Action {
  readonly type = LOAD_USER_MAKER_CHECKER;

  constructor(public payload?: any) {
  }
}

export class LoadingUserMakerChecker implements Action {
  readonly type = LOADING_USER_MAKER_CHECKER;

  constructor(public payload?: any) {
  }
}

export class LoadUserMakerCheckerSuccess implements Action {
  readonly type = LOAD_USER_MAKER_CHECKER_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadUserMakerCheckerFailure implements Action {
  readonly type = LOAD_USER_MAKER_CHECKER_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetUserMakerChecker implements Action {
  readonly type = RESET_USER_MAKER_CHECKER;

  constructor(public payload?: any) {
  }
}

export class SetUserMakerCheckerBreadcrumb implements Action {
  readonly type = USER_MAKER_CHECKER_SET_BREADCRUMB;

  constructor(public payload?: any) {
  }
}

export type UserMakerCheckerActions =
  LoadUserMakerChecker |
  LoadingUserMakerChecker |
  LoadUserMakerCheckerSuccess |
  LoadUserMakerCheckerFailure |
  ResetUserMakerChecker |
  SetUserMakerCheckerBreadcrumb;
