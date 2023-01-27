import { Action } from '@ngrx/store';

export const CREATE_USER = '[USER] CREATE_USER';
export const CREATE_USER_LOADING = '[USER] CREATE_USER_LOADING';
export const CREATE_USER_SUCCESS = '[USER] CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = '[USER] CREATE_USER_FAILURE';
export const CREATE_USER_RESET = '[USER] CREATE_USER_RESET';

export class CreateUser implements Action {
  readonly type = CREATE_USER;

  constructor(public payload?: any) {
  }
}

export class CreateUserLoading implements Action {
  readonly type = CREATE_USER_LOADING;

  constructor(public payload?: any) {
  }
}

export class CreateUserSuccess implements Action {
  readonly type = CREATE_USER_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class CreateUserFailure implements Action {
  readonly type = CREATE_USER_FAILURE;

  constructor(public payload?: any) {
  }
}

export class CreateUserReset implements Action {
  readonly type = CREATE_USER_RESET;

  constructor(public payload?: any) {
  }
}

export type UserCreateActions = CreateUser | CreateUserLoading | CreateUserSuccess | CreateUserFailure | CreateUserReset;
