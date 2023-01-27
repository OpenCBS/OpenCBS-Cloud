import { Action } from '@ngrx/store';

export const LOAD_TERM_DEPOSITS_PROFILE = '[TERM_DEPOSIT_PROFILE_LIST] LOAD_TERM_DEPOSIT_PROFILE';
export const LOAD_TERM_DEPOSITS_PROFILE_SUCCESS = '[TERM_DEPOSIT_PROFILE_LIST] LOAD_TERM_DEPOSIT_PROFILE_SUCCESS';
export const LOAD_TERM_DEPOSITS_PROFILE_FAILURE = '[TERM_DEPOSIT_PROFILE_LIST] LOAD_TERM_DEPOSIT_PROFILE_FAILURE';
export const LOADING_TERM_DEPOSITS_PROFILE = '[TERM_DEPOSIT_PROFILE_LIST] LOADING_TERM_DEPOSIT_PROFILE';

export class LoadTermDepositsProfile implements Action {
  readonly type = LOAD_TERM_DEPOSITS_PROFILE;
  constructor(public payload?: any) {}
}
export class LoadingTermDepositsProfile implements Action {
  readonly type = LOADING_TERM_DEPOSITS_PROFILE;
  constructor(public payload?: any) {}
}
export class LoadTermDepositsProfileSuccess implements Action {
  readonly type = LOAD_TERM_DEPOSITS_PROFILE_SUCCESS;
  constructor(public payload?: any) {}
}
export class LoadTermDepositsProfileFailure implements Action {
  readonly type = LOAD_TERM_DEPOSITS_PROFILE_FAILURE;
  constructor(public payload?: any) {}
}

export type TermDepositProfileListActions =
  LoadTermDepositsProfile
  | LoadingTermDepositsProfile
  | LoadTermDepositsProfileSuccess
  | LoadTermDepositsProfileFailure;
