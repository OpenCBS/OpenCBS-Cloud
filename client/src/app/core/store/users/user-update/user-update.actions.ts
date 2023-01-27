import { Action } from '@ngrx/store';

export const UPDATE_USER = '[USER_UPDATE] UPDATE_USER';
export const UPDATE_USER_LOADING = '[USER_UPDATE] UPDATE_USER_LOADING';
export const UPDATE_USER_SUCCESS = '[USER_UPDATE] UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILURE = '[USER_UPDATE] UPDATE_USER_FAILURE';
export const UPDATE_USER_RESET = '[USER_UPDATE] UPDATE_USER_RESET';
export const UPDATE_USER_PASSWORD = '[USER_UPDATE] UPDATE_USER_PASSWORD';

export class UpdateUser implements Action {
  readonly type = UPDATE_USER;

  constructor(public payload?: any) {
  }
}

export class UpdateUserLoading implements Action {
  readonly type = UPDATE_USER_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdateUserSuccess implements Action {
  readonly type = UPDATE_USER_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateUserFailure implements Action {
  readonly type = UPDATE_USER_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateUserReset implements Action {
  readonly type = UPDATE_USER_RESET;

  constructor(public payload?: any) {
  }
}

export class UpdateUserPassword implements Action {
  readonly type = UPDATE_USER_PASSWORD;

  constructor(public payload?: any) {
  }
}

export type UserUpdateActions =
  UpdateUser
  | UpdateUserLoading
  | UpdateUserSuccess
  | UpdateUserFailure
  | UpdateUserReset
  | UpdateUserPassword
