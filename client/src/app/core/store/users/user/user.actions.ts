import { Action } from '@ngrx/store';

export const LOAD_USER = '[USER] LOAD_USER';
export const LOADING_USER = '[USER] LOADING_USER';
export const LOAD_USER_SUCCESS = '[USER] LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = '[USER] LOAD_USER_FAILURE';
export const RESET_USER = '[USER] RESET_USER';
export const USER_SET_BREADCRUMB = '[USER] USER_SET_BREADCRUMB';

export class LoadUser implements Action {
  readonly type = LOAD_USER;

  constructor(public payload?: any) {
  }
}

export class LoadingUser implements Action {
  readonly type = LOADING_USER;

  constructor(public payload?: any) {
  }
}

export class LoadUserSuccess implements Action {
  readonly type = LOAD_USER_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadUserFailure implements Action {
  readonly type = LOAD_USER_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetUser implements Action {
  readonly type = RESET_USER;

  constructor(public payload?: any) {
  }
}

export class SetUserBreadcrumb implements Action {
  readonly type = USER_SET_BREADCRUMB;

  constructor(public payload?: any) {
  }
}

export type UserActions =
  LoadUser |
  LoadingUser |
  LoadUserSuccess |
  LoadUserFailure |
  ResetUser |
  SetUserBreadcrumb;
