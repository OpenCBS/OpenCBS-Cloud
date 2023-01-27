import { Action } from '@ngrx/store';

export const UPDATE_HOLIDAY = '[HOLIDAY_UPDATE] UPDATE_HOLIDAY';
export const UPDATE_HOLIDAY_LOADING = '[HOLIDAY_UPDATE] UPDATE_HOLIDAY_LOADING';
export const UPDATE_HOLIDAY_SUCCESS = '[HOLIDAY_UPDATE] UPDATE_HOLIDAY_SUCCESS';
export const UPDATE_HOLIDAY_FAILURE = '[HOLIDAY_UPDATE] UPDATE_HOLIDAY_FAILURE';
export const UPDATE_HOLIDAY_RESET = '[HOLIDAY_UPDATE] UPDATE_HOLIDAY_RESET';

export class UpdateHoliday implements Action {
  readonly type = UPDATE_HOLIDAY;

  constructor(public payload?: any) {
  }
}

export class UpdateHolidayLoading implements Action {
  readonly type = UPDATE_HOLIDAY_LOADING;
}

export class UpdateHolidaySuccess implements Action {
  readonly type = UPDATE_HOLIDAY_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateHolidayFailure implements Action {
  readonly type = UPDATE_HOLIDAY_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateHolidayReset implements Action {
  readonly type = UPDATE_HOLIDAY_RESET;
}

export type HolidayUpdateActions = UpdateHoliday | UpdateHolidayLoading | UpdateHolidaySuccess | UpdateHolidayFailure | UpdateHolidayReset;
