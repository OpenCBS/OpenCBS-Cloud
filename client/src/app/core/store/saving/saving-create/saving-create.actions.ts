import { Action } from '@ngrx/store';

export const CREATE_SAVING = '[SAVING_CREATE] CREATE_SAVING';
export const CREATE_SAVING_LOADING = '[SAVING_CREATE] CREATE_SAVING_LOADING';
export const CREATE_SAVING_SUCCESS = '[SAVING_CREATE] CREATE_SAVING_SUCCESS';
export const CREATE_SAVING_FAILURE = '[SAVING_CREATE] CREATE_SAVING_FAILURE';
export const CREATE_SAVING_RESET = '[SAVING_CREATE] CREATE_SAVING_RESET';

export class CreateSaving implements Action {
  readonly type = CREATE_SAVING;

  constructor(public payload?: any) {
  }
}

export class CreateSavingLoading implements Action {
  readonly type = CREATE_SAVING_LOADING;

  constructor(public payload?: any) {
  }
}

export class CreateSavingSuccess implements Action {
  readonly type = CREATE_SAVING_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class CreateSavingFailure implements Action {
  readonly type = CREATE_SAVING_FAILURE;

  constructor(public payload?: any) {
  }
}

export class CreateSavingReset implements Action {
  readonly type = CREATE_SAVING_RESET;

  constructor(public payload?: any) {
  }
}

export type SavingCreateActions =
  CreateSaving
  | CreateSavingLoading
  | CreateSavingSuccess
  | CreateSavingFailure
  | CreateSavingReset;
