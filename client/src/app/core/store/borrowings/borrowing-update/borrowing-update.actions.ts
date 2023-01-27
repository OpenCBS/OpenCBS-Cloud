import { Action } from '@ngrx/store';

export const UPDATE_BORROWING = '[BORROWING_UPDATE] ';
export const UPDATE_BORROWING_LOADING = '[BORROWING_UPDATE] UPDATE_BORROWING_LOADING';
export const UPDATE_BORROWING_SUCCESS = '[BORROWING_UPDATE] UPDATE_BORROWING_SUCCESS';
export const UPDATE_BORROWING_FAILURE = '[BORROWING_UPDATE] UPDATE_BORROWING_FAILURE';
export const UPDATE_BORROWING_RESET = '[BORROWING_UPDATE] UPDATE_BORROWING_RESET';

export class UpdateBorrowing implements Action {
  readonly type = UPDATE_BORROWING;

  constructor(public payload?: any) {
  }
}

export class UpdateBorrowingLoading implements Action {
  readonly type = UPDATE_BORROWING_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdateBorrowingSuccess implements Action {
  readonly type = UPDATE_BORROWING_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateBorrowingFailure implements Action {
  readonly type = UPDATE_BORROWING_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateBorrowingReset implements Action {
  readonly type = UPDATE_BORROWING_RESET;

  constructor(public payload?: any) {
  }
}

export type BorrowingUpdateActions =
  UpdateBorrowing | UpdateBorrowingLoading | UpdateBorrowingSuccess | UpdateBorrowingFailure | UpdateBorrowingReset;
