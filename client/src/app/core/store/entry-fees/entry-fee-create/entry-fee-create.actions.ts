import { Action } from '@ngrx/store';

export const CREATE_ENTRY_FEE = '[ENTRY_FEE_CREATE] CREATE_ENTRY_FEE';
export const CREATE_ENTRY_FEE_LOADING = '[ENTRY_FEE_CREATE] CREATE_ENTRY_FEE_LOADING';
export const CREATE_ENTRY_FEE_SUCCESS = '[ENTRY_FEE_CREATE] CREATE_ENTRY_FEE_SUCCESS';
export const CREATE_ENTRY_FEE_FAILURE = '[ENTRY_FEE_CREATE] CREATE_ENTRY_FEE_FAILURE';
export const CREATE_ENTRY_FEE_RESET = '[ENTRY_FEE_CREATE] CREATE_ENTRY_FEE_RESET';

export class CreateEntryFee implements Action {
  readonly type = CREATE_ENTRY_FEE;

  constructor(public payload: any) {
  }
}

export class CreateEntryFeeLoading implements Action {
  readonly type = CREATE_ENTRY_FEE_LOADING;
}

export class CreateEntryFeeSuccess implements Action {
  readonly type = CREATE_ENTRY_FEE_SUCCESS;
}

export class CreateEntryFeeFailure implements Action {
  readonly type = CREATE_ENTRY_FEE_FAILURE;

  constructor(public payload: any) {
  }
}

export class CreateEntryFeeReset implements Action {
  readonly type = CREATE_ENTRY_FEE_RESET;
}


export type EntryFeeCreateActions =
  CreateEntryFee
  | CreateEntryFeeLoading
  | CreateEntryFeeSuccess
  | CreateEntryFeeFailure
  | CreateEntryFeeReset;
