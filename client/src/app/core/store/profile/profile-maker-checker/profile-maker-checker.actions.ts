import { Action } from '@ngrx/store';

export const LOAD_PROFILE_MAKER_CHECKER = '[PROFILE_MAKER_CHECKER] LOAD_PROFILE_MAKER_CHECKER';
export const LOAD_PROFILE_MAKER_CHECKER_SUCCESS = '[PROFILE_MAKER_CHECKER] LOAD_PROFILE_MAKER_CHECKER_SUCCESS';
export const LOAD_PROFILE_MAKER_CHECKER_FAILURE = '[PROFILE_MAKER_CHECKER] LOAD_PROFILE_MAKER_CHECKER_FAILURE';
export const LOADING_PROFILE_MAKER_CHECKER = '[PROFILE_MAKER_CHECKER] LOADING_PROFILE_MAKER_CHECKER';
export const RESET_PROFILE_MAKER_CHECKER = '[PROFILE_MAKER_CHECKER] RESET_PROFILE_MAKER_CHECKER';

export class LoadProfileMakerChecker implements Action {
  readonly type = LOAD_PROFILE_MAKER_CHECKER;

  constructor(public payload: any) {
  }
}

export class LoadProfileMakerCheckerSuccess implements Action {
  readonly type = LOAD_PROFILE_MAKER_CHECKER_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadProfileMakerCheckerFailure implements Action {
  readonly type = LOAD_PROFILE_MAKER_CHECKER_FAILURE;

  constructor(public payload?: any) {
  }
}

export class LoadingProfileMakerChecker implements Action {
  readonly type = LOADING_PROFILE_MAKER_CHECKER;

  constructor(public payload?: any) {
  }
}

export class ResetProfileMakerChecker implements Action {
  readonly type = RESET_PROFILE_MAKER_CHECKER;

  constructor(public payload?: any) {
  }
}

export type ProfileMakerCheckerActions =
  LoadProfileMakerChecker
  | LoadProfileMakerCheckerSuccess
  | LoadProfileMakerCheckerFailure
  | LoadingProfileMakerChecker
  | ResetProfileMakerChecker;
