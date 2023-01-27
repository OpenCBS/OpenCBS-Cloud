import { Action } from '@ngrx/store';

export const LOAD_CURRENT_USER_FAILURE = '[CURRENT_USER] LOAD_CURRENT_USER_FAILURE';
export const LOAD_CURRENT_USER_SUCCESS = '[CURRENT_USER] LOAD_CURRENT_USER_SUCCESS';
export const LOAD_CURRENT_USER = '[CURRENT_USER] LOAD_CURRENT_USER';
export const CURRENT_USER_LOADING = '[CURRENT_USER] CURRENT_CURRENT_USER_LOADING';
export const CURRENT_USER_LOGOUT = '[CURRENT_USER] CURRENT_CURRENT_USER_LOGOUT';

export class LoadCurrentUserSuccess implements Action {
  readonly type = LOAD_CURRENT_USER_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadCurrentUserFailure implements Action {
  readonly type = LOAD_CURRENT_USER_FAILURE;

  constructor(public payload?: any) {
  }
}

export class LoadCurrentUser implements Action {
  readonly type = LOAD_CURRENT_USER;

  constructor(public payload?: any) {
  }
}

export class CurrentUserLoading implements Action {
  readonly type = CURRENT_USER_LOADING;

  constructor(public payload?: any) {
  }
}

export class CurrentUserLogout implements Action {
  readonly type = CURRENT_USER_LOGOUT;

  constructor(public payload?: any) {
  }
}

export type CurrentUserActions = LoadCurrentUserSuccess | LoadCurrentUserFailure | LoadCurrentUser | CurrentUserLoading | CurrentUserLogout;
