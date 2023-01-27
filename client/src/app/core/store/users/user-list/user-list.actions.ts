import { Action } from '@ngrx/store';

export const LOAD_USERS = '[USERS] LOAD_USERS';
export const LOADING_USERS = '[USERS] LOADING_USERS';
export const LOAD_USERS_SUCCESS = '[USERS] LOAD_USERS_SUCCESS';
export const LOAD_USERS_FAILURE = '[USERS] LOAD_USERS_FAILURE';

export class LoadUserList implements Action {
  readonly type = LOAD_USERS;

  constructor(public payload?: any) {
  }
}

export class LoadingUserList implements Action {
  readonly type = LOADING_USERS;

  constructor(public payload?: any) {
  }
}

export class LoadUserListSuccess implements Action {
  readonly type = LOAD_USERS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadUserListFail implements Action {
  readonly type = LOAD_USERS_FAILURE;

  constructor(public payload?: any) {
  }
}

export type UserListActions = LoadUserList | LoadingUserList | LoadUserListSuccess | LoadUserListFail;
