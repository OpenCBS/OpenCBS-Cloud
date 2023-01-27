import { Action } from '@ngrx/store';

export const LOAD_BORROWING_SCHEDULE = '[BORROWING_SCHEDULE] LOAD_BORROWING_SCHEDULE';
export const LOADING_BORROWING_SCHEDULE = '[BORROWING_SCHEDULE] LOADING_BORROWING_SCHEDULE';
export const LOAD_BORROWING_SCHEDULE_SUCCESS = '[BORROWING_SCHEDULE] LOAD_BORROWING_SCHEDULE_SUCCESS';
export const LOAD_BORROWING_SCHEDULE_FAILURE = '[BORROWING_SCHEDULE] LOAD_BORROWING_SCHEDULE_FAILURE';
export const RESET_BORROWING_SCHEDULE = '[BORROWING_SCHEDULE] RESET_BORROWING_SCHEDULE';
export const LOAD_ACTIVE_BORROWING_SCHEDULE = '[BORROWING_SCHEDULE] LOAD_ACTIVE_BORROWING_SCHEDULE';

export class LoadBorrowingSchedule implements Action {
  readonly type = LOAD_BORROWING_SCHEDULE;

  constructor(public payload?: any) {
  }
}

export class LoadActiveBorrowingSchedule implements Action {
  readonly type = LOAD_ACTIVE_BORROWING_SCHEDULE;

  constructor(public payload?: any) {
  }
}

export class LoadingBorrowingSchedule implements Action {
  readonly type = LOADING_BORROWING_SCHEDULE;

  constructor(public payload?: any) {
  }
}

export class LoadBorrowingScheduleSuccess implements Action {
  readonly type = LOAD_BORROWING_SCHEDULE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadBorrowingScheduleFailure implements Action {
  readonly type = LOAD_BORROWING_SCHEDULE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetBorrowingSchedule implements Action {
  readonly type = RESET_BORROWING_SCHEDULE;
}

export type BorrowingScheduleActions =
  LoadBorrowingSchedule
  | LoadingBorrowingSchedule
  | LoadBorrowingScheduleSuccess
  | LoadBorrowingScheduleFailure
  | ResetBorrowingSchedule
  | LoadActiveBorrowingSchedule;
