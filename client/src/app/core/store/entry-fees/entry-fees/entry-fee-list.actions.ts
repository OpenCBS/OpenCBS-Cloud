import { Action } from '@ngrx/store';

export const LOAD_ENTRY_FEES = '[ENTRY_FEE_LIST] LOAD_ENTRY_FEES';
export const LOAD_ENTRY_FEES_SUCCESS = '[ENTRY_FEE_LIST] LOAD_ENTRY_FEES_SUCCESS';
export const LOAD_ENTRY_FEES_FAILURE = '[ENTRY_FEE_LIST] LOAD_ENTRY_FEE_FAILURE';
export const LOADING_ENTRY_FEES = '[ENTRY_FEE_LIST] LOADING_ENTRY_FEES';
export const ENTRY_FEE_LIST_RESET = '[ENTRY_FEE_LIST] ENTRY_FEE_LIST_RESET';

export class LoadEntryFees implements Action {
  readonly type = LOAD_ENTRY_FEES;
}

export class LoadingEntryFees implements Action {
  readonly type = LOADING_ENTRY_FEES;
}

export class LoadEntryFeesSuccess implements Action {
  readonly type = LOAD_ENTRY_FEES_SUCCESS;

  constructor(public payload: any) {
  }
}

export class LoadEntryFeesFailure implements Action {
  readonly type = LOAD_ENTRY_FEES_FAILURE;

  constructor(public payload: any) {
  }
}

export class EntryFeesListReset implements Action {
  readonly type = ENTRY_FEE_LIST_RESET;
}

export type EntryFeeListActions = LoadEntryFees | LoadingEntryFees | LoadEntryFeesSuccess | LoadEntryFeesFailure | EntryFeesListReset;
