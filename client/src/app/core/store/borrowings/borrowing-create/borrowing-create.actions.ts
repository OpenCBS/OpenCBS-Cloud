import { Action } from '@ngrx/store';

export const CREATE_BORROWING = '[BORROWING_CREATE] CREATE_BORROWING';
export const CREATE_BORROWING_LOADING = '[BORROWING_CREATE] CREATE_BORROWING_LOADING';
export const CREATE_BORROWING_SUCCESS = '[BORROWING_CREATE] CREATE_BORROWING_SUCCESS';
export const CREATE_BORROWING_FAILURE = '[BORROWING_CREATE] CREATE_BORROWING_FAILURE';
export const CREATE_BORROWING_RESET = '[BORROWING_CREATE] CREATE_BORROWING_RESET';

export class CreateBorrowing implements Action {
  readonly type = CREATE_BORROWING;

  constructor(public payload?: any) {
  }
}

export class CreateBorrowingLoading implements Action {
  readonly type = CREATE_BORROWING_LOADING;

  constructor(public payload?: any) {
  }
}

export class CreateBorrowingSuccess implements Action {
  readonly type = CREATE_BORROWING_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class CreateBorrowingFailure implements Action {
  readonly type = CREATE_BORROWING_FAILURE;

  constructor(public payload?: any) {
  }
}

export class CreateBorrowingReset implements Action {
  readonly type = CREATE_BORROWING_RESET;

  constructor(public payload?: any) {
  }
}

export type BorrowingCreateActions =
  CreateBorrowing
  | CreateBorrowingLoading
  | CreateBorrowingSuccess
  | CreateBorrowingFailure
  | CreateBorrowingReset;
