import { Action } from '@ngrx/store';

export const UPDATE_SAVING = '[SAVING_UPDATE] ';
export const UPDATE_SAVING_LOADING = '[SAVING_UPDATE] UPDATE_SAVING_LOADING';
export const UPDATE_SAVING_SUCCESS = '[SAVING_UPDATE] UPDATE_SAVING_SUCCESS';
export const UPDATE_SAVING_FAILURE = '[SAVING_UPDATE] UPDATE_SAVING_FAILURE';
export const UPDATE_SAVING_RESET = '[SAVING_UPDATE] UPDATE_SAVING_RESET';

export class UpdateSaving implements Action {
  readonly type = UPDATE_SAVING;

  constructor(public payload?: any) {
  }
}

export class UpdateSavingLoading implements Action {
  readonly type = UPDATE_SAVING_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdateSavingSuccess implements Action {
  readonly type = UPDATE_SAVING_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateSavingFailure implements Action {
  readonly type = UPDATE_SAVING_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateSavingReset implements Action {
  readonly type = UPDATE_SAVING_RESET;

  constructor(public payload?: any) {
  }
}

export type SavingUpdateActions =
  UpdateSaving
  | UpdateSavingLoading
  | UpdateSavingSuccess
  | UpdateSavingFailure
  | UpdateSavingReset;
