import { Action } from '@ngrx/store';

export const UPDATE_PROFILE = '[PROFILE] UPDATE_PROFILE';
export const UPDATE_PROFILE_LOADING = '[PROFILE] UPDATE_PROFILE_LOADING';
export const UPDATE_PROFILE_SUCCESS = '[PROFILE] UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAILURE = '[PROFILE] UPDATE_PROFILE_FAILURE';
export const UPDATE_PROFILE_RESET = '[PROFILE] UPDATE_PROFILE_RESET';

export class UpdateProfile implements Action {
  readonly type = UPDATE_PROFILE;

  constructor(public payload?: any) {
  }
}

export class UpdateProfileLoading implements Action {
  readonly type = UPDATE_PROFILE_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdateProfileSuccess implements Action {
  readonly type = UPDATE_PROFILE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateProfileFailure implements Action {
  readonly type = UPDATE_PROFILE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateProfileReset implements Action {
  readonly type = UPDATE_PROFILE_RESET;

  constructor(public payload?: any) {
  }
}

export type ProfileUpdateActions = UpdateProfile | UpdateProfileLoading | UpdateProfileSuccess | UpdateProfileFailure | UpdateProfileReset;
