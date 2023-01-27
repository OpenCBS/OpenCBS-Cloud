import { Action } from '@ngrx/store';

export const CREATE_PROFILE = '[PROFILE_CREATE] CREATE_PROFILE';
export const CREATE_PROFILE_LOADING = '[PROFILE_CREATE] CREATE_PROFILE_LOADING';
export const CREATE_PROFILE_SUCCESS = '[PROFILE_CREATE] CREATE_PROFILE_SUCCESS';
export const CREATE_PROFILE_FAILURE = '[PROFILE_CREATE] CREATE_PROFILE_FAILURE';
export const CREATE_PROFILE_RESET = '[PROFILE_CREATE] CREATE_PROFILE_RESET';

export class CreateProfile implements Action {
  readonly type = CREATE_PROFILE;

  constructor(public payload?: any) {
  }
}

export class CreateProfileLoading implements Action {
  readonly type = CREATE_PROFILE_LOADING;

  constructor(public payload?: any) {
  }
}

export class CreateProfileSuccess implements Action {
  readonly type = CREATE_PROFILE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class CreateProfileFailure implements Action {
  readonly type = CREATE_PROFILE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class CreateProfileReset implements Action {
  readonly type = CREATE_PROFILE_RESET;

  constructor(public payload?: any) {
  }
}

export type ProfileCreateActions = CreateProfile | CreateProfileLoading | CreateProfileSuccess | CreateProfileFailure | CreateProfileReset;
