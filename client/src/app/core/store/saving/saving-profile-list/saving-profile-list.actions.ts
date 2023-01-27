import { Action } from '@ngrx/store';

export const LOAD_SAVINGS_PROFILE = '[SAVING_PROFILE_LIST] LOAD_SAVING_PROFILE';
export const LOAD_SAVINGS_PROFILE_SUCCESS = '[SAVING_PROFILE_LIST] LOAD_SAVING_PROFILE_SUCCESS';
export const LOAD_SAVINGS_PROFILE_FAILURE = '[SAVING_PROFILE_LIST] LOAD_SAVING_PROFILE_FAILURE';
export const LOADING_SAVINGS_PROFILE = '[SAVING_PROFILE_LIST] LOADING_SAVING_PROFILE';

export class LoadSavingsProfile implements Action {
  readonly type = LOAD_SAVINGS_PROFILE;

  constructor(public payload?: any) {
  }
}

export class LoadingSavingsProfile implements Action {
  readonly type = LOADING_SAVINGS_PROFILE;

  constructor(public payload?: any) {
  }
}

export class LoadSavingsProfileSuccess implements Action {
  readonly type = LOAD_SAVINGS_PROFILE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadSavingsProfileFailure implements Action {
  readonly type = LOAD_SAVINGS_PROFILE_FAILURE;

  constructor(public payload?: any) {
  }
}

export type SavingProfileListActions =
  LoadSavingsProfile
  | LoadingSavingsProfile
  | LoadSavingsProfileSuccess
  | LoadSavingsProfileFailure;
