import { Action } from '@ngrx/store';

export const LOAD_SAVING = '[SAVING] LOAD_SAVING';
export const LOADING_SAVING = '[SAVING] LOADING_SAVING';
export const LOAD_SAVING_SUCCESS = '[SAVING] LOAD_SAVING_SUCCESS';
export const LOAD_SAVING_FAILURE = '[SAVING] LOAD_SAVING_FAILURE';
export const RESET_SAVING = '[SAVING] RESET_SAVING';
export const DISBURSE_SAVING = '[SAVING] DISBURSE_SAVING';
export const SAVING_SET_BREADCRUMB = '[SAVING] SAVING_SET_BREADCRUMB';

export class LoadSaving implements Action {
  readonly type = LOAD_SAVING;

  constructor(public payload: any) {
  }
}

export class LoadingSaving implements Action {
  readonly type = LOADING_SAVING;
}

export class LoadSavingSuccess implements Action {
  readonly type = LOAD_SAVING_SUCCESS;

  constructor(public payload: any) {
  }
}

export class LoadSavingFailure implements Action {
  readonly type = LOAD_SAVING_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetSaving implements Action {
  readonly type = RESET_SAVING;

  constructor(public payload?: any) {
  }
}

export class SetSavingBreadcrumb implements Action {
  readonly type = SAVING_SET_BREADCRUMB;

  constructor(public payload?: any) {
  }
}

export class DisburseSaving implements Action {
  readonly type = DISBURSE_SAVING;

  constructor(public payload?: any) {
  }
}

export type SavingActions =
  LoadSaving
  | LoadingSaving
  | LoadSavingSuccess
  | LoadSavingFailure
  | ResetSaving
  | DisburseSaving
  | SetSavingBreadcrumb;
