import { Action } from '@ngrx/store';

export const LOAD_ACCOUNTING_ENTRIES = '[ACCOUNTING_ENTRIES] Load entries';
export const LOAD_ACCOUNTING_ENTRIES_SUCCESS = '[ACCOUNTING_ENTRIES] Load entries success';
export const LOAD_ACCOUNTING_ENTRIES_FAILURE = '[ACCOUNTING_ENTRIES] Load entries failure';
export const RESET_ACCOUNTING_ENTRIES = '[ACCOUNTING_ENTRIES] Reset entries';

export class LoadAccountingEntries implements Action {
  readonly type = LOAD_ACCOUNTING_ENTRIES;

  constructor(public payload?: any) {
  }
}

export class LoadAccountingEntriesSuccess implements Action {
  readonly type = LOAD_ACCOUNTING_ENTRIES_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadAccountingEntriesFailure implements Action {
  readonly type = LOAD_ACCOUNTING_ENTRIES_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetAccountingEntries implements Action {
  readonly type = RESET_ACCOUNTING_ENTRIES;

  constructor(public payload?: any) {
  }
}

export type AccountingEntriesActions =
  LoadAccountingEntries
  | LoadAccountingEntriesSuccess
  | LoadAccountingEntriesFailure
  | ResetAccountingEntries;

