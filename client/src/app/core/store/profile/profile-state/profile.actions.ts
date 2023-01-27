import { Action } from '@ngrx/store';

export const LOAD_PROFILE_INFO = '[PROFILE] LOAD_PROFILE_INFO';
export const LOAD_PROFILE_INFO_SUCCESS = '[PROFILE] LOAD_PROFILE_INFO_SUCCESS';
export const LOAD_PROFILE_INFO_FAILURE = '[PROFILE] LOAD_PROFILE_INFO_FAILURE';
export const LOADING_PROFILE_INFO = '[PROFILE] LOADING_PROFILE_INFO';
export const RESET_PROFILE_INFO = '[PROFILE] RESET_PROFILE_INFO';
export const CREATE_CURRENT_ACCOUNT = '[PROFILE] CREATE_CURRENT_ACCOUNT';

export class LoadProfileInfo implements Action {
  readonly type = LOAD_PROFILE_INFO;

  constructor(public payload: any) {
  }
}

export class LoadProfileInfoSuccess implements Action {
  readonly type = LOAD_PROFILE_INFO_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadProfileInfoFailure implements Action {
  readonly type = LOAD_PROFILE_INFO_FAILURE;

  constructor(public payload?: any) {
  }
}

export class LoadingProfileInfo implements Action {
  readonly type = LOADING_PROFILE_INFO;

  constructor(public payload?: any) {
  }
}

export class ResetProfileInfo implements Action {
  readonly type = RESET_PROFILE_INFO;

  constructor(public payload?: any) {
  }
}

export class CreateCurrentAccount implements Action {
  readonly type = CREATE_CURRENT_ACCOUNT;

  constructor(public payload?: any) {
  }
}

export type ProfileStateActions =
  LoadProfileInfo
  | LoadProfileInfoSuccess
  | LoadProfileInfoFailure
  | LoadingProfileInfo
  | ResetProfileInfo
  | CreateCurrentAccount;
