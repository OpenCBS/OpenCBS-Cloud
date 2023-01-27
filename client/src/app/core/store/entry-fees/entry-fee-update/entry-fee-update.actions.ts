import { Action } from '@ngrx/store';

export const UPDATE_ENTRY_FEE = '[ENTRY_FEE_UPDATE] UPDATE_ENTRY_FEE';
export const UPDATE_ENTRY_FEE_LOADING = '[ENTRY_FEE_UPDATE] UPDATE_ENTRY_FEE_LOADING';
export const UPDATE_ENTRY_FEE_SUCCESS = '[ENTRY_FEE_UPDATE] UPDATE_ENTRY_FEE_SUCCESS';
export const UPDATE_ENTRY_FEE_FAILURE = '[ENTRY_FEE_UPDATE] UPDATE_ENTRY_FEE_FAILURE';
export const UPDATE_ENTRY_FEE_RESET = '[ENTRY_FEE_UPDATE] UPDATE_ENTRY_FEE_RESET';

export class UpdateEntryFee implements Action {
  readonly type = UPDATE_ENTRY_FEE;

  constructor(public payload?: any) {
  }
}

export class UpdateEntryFeeLoading implements Action {
  readonly type = UPDATE_ENTRY_FEE_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdateEntryFeeSuccess implements Action {
  readonly type = UPDATE_ENTRY_FEE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateEntryFeeFailure implements Action {
  readonly type = UPDATE_ENTRY_FEE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateEntryFeeReset implements Action {
  readonly type = UPDATE_ENTRY_FEE_RESET;

  constructor(public payload?: any) {
  }
}

export type EntryFeeUpdateActions =
  UpdateEntryFee
  | UpdateEntryFeeLoading
  | UpdateEntryFeeSuccess
  | UpdateEntryFeeFailure
  | UpdateEntryFeeReset;
