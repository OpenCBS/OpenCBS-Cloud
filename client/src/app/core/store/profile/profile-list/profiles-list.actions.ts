import { Action } from '@ngrx/store';

export const LOAD_PROFILES = '[PROFILE_LIST] LOAD_PROFILES';
export const LOAD_PROFILES_SUCCESS = '[PROFILE_LIST] LOAD_PROFILES_SUCCESS';
export const LOAD_PROFILES_FAILURE = '[PROFILE_LIST] LOAD_PROFILES_FAILURE';
export const LOADING_PROFILES = '[PROFILE_LIST] LOADING_PROFILES';

export class LoadProfiles implements Action {
  readonly type = LOAD_PROFILES;

  constructor(public payload?: any) {
  }
}

export class LoadingProfiles implements Action {
  readonly type = LOADING_PROFILES;

  constructor(public payload?: any) {
  }
}

export class LoadProfilesSuccess implements Action {
  readonly type = LOAD_PROFILES_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadProfilesFailure implements Action {
  readonly type = LOAD_PROFILES_FAILURE;

  constructor(public payload?: any) {
  }
}

export type ProfilesListActions = LoadProfiles | LoadingProfiles | LoadProfilesSuccess | LoadProfilesFailure;
