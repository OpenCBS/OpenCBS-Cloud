import { Action } from '@ngrx/store';

export const LOAD_BORROWINGS = '[BORROWING_LIST] LOAD_BORROWINGS';
export const LOAD_BORROWINGS_SUCCESS = '[BORROWING_LIST] LOAD_BORROWINGS_SUCCESS';
export const LOAD_BORROWINGS_FAILURE = '[BORROWING_LIST] LOAD_BORROWINGS_FAILURE';
export const LOADING_BORROWINGS = '[BORROWING_LIST] LOADING_BORROWINGS';

export class LoadBorrowings implements Action {
  readonly type = LOAD_BORROWINGS;

  constructor(public payload?: any) {
  }
}

export class LoadingBorrowings implements Action {
  readonly type = LOADING_BORROWINGS;

  constructor(public payload?: any) {
  }
}

export class LoadBorrowingsSuccess implements Action {
  readonly type = LOAD_BORROWINGS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadBorrowingsFailure implements Action {
  readonly type = LOAD_BORROWINGS_FAILURE;

  constructor(public payload?: any) {
  }
}

export type BorrowingListActions = LoadBorrowings | LoadingBorrowings | LoadBorrowingsSuccess | LoadBorrowingsFailure;
