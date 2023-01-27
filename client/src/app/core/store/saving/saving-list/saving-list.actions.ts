import { Action } from '@ngrx/store';

export const LOAD_SAVINGS = '[SAVING_LIST] LOAD_SAVING';
export const LOAD_SAVINGS_SUCCESS = '[SAVING_LIST] LOAD_SAVING_SUCCESS';
export const LOAD_SAVINGS_FAILURE = '[SAVING_LIST] LOAD_SAVING_FAILURE';
export const LOADING_SAVINGS = '[SAVING_LIST] LOADING_SAVING';

export class LoadSavings implements Action {
  readonly type = LOAD_SAVINGS;

  constructor(public payload?: any) {
  }
}

export class LoadingSavings implements Action {
  readonly type = LOADING_SAVINGS;

  constructor(public payload?: any) {
  }
}

export class LoadSavingsSuccess implements Action {
  readonly type = LOAD_SAVINGS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadSavingsFailure implements Action {
  readonly type = LOAD_SAVINGS_FAILURE;

  constructor(public payload?: any) {
  }
}

export type SavingListActions =
  LoadSavings
  | LoadingSavings
  | LoadSavingsSuccess
  | LoadSavingsFailure;
