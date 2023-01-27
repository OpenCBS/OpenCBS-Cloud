import { Action } from '@ngrx/store';

export const LOAD_BORROWING = '[BORROWING] LOAD_BORROWING';
export const LOADING_BORROWING = '[BORROWING] LOADING_BORROWING';
export const LOAD_BORROWING_SUCCESS = '[BORROWING] LOAD_BORROWING_SUCCESS';
export const LOAD_BORROWING_FAILURE = '[BORROWING] LOAD_BORROWING_FAILURE';
export const RESET_BORROWING = '[BORROWING] RESET_BORROWING';
export const DISBURSE_BORROWING = '[BORROWING] DISBURSE_BORROWING';
export const BORROWING_SET_BREADCRUMB = '[BORROWING] BORROWING_SET_BREADCRUMB';

export class LoadBorrowing implements Action {
  readonly type = LOAD_BORROWING;

  constructor(public payload: any) {
  }
}

export class LoadingBorrowing implements Action {
  readonly type = LOADING_BORROWING;
}

export class LoadBorrowingSuccess implements Action {
  readonly type = LOAD_BORROWING_SUCCESS;

  constructor(public payload: any) {
  }
}

export class LoadBorrowingFailure implements Action {
  readonly type = LOAD_BORROWING_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetBorrowing implements Action {
  readonly type = RESET_BORROWING;

  constructor(public payload?: any) {
  }
}

export class SetBorrowingBreadcrumb implements Action {
  readonly type = BORROWING_SET_BREADCRUMB;

  constructor(public payload?: any) {
  }
}

export class DisburseBorrowing implements Action {
  readonly type = DISBURSE_BORROWING;

  constructor(public payload?: any) {
  }
}

export type BorrowingActions =
  LoadBorrowing
  | LoadingBorrowing
  | LoadBorrowingSuccess
  | LoadBorrowingFailure
  | ResetBorrowing
  | DisburseBorrowing
  | SetBorrowingBreadcrumb;
