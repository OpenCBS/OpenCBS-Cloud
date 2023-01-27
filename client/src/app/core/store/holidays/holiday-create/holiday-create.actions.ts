import { Action } from '@ngrx/store';

export const CREATE_HOLIDAY = '[HOLIDAY_CREATE] CREATE_HOLIDAY';
export const CREATE_HOLIDAY_LOADING = '[HOLIDAY_CREATE] CREATE_HOLIDAY_LOADING';
export const CREATE_HOLIDAY_SUCCESS = '[HOLIDAY_CREATE] CREATE_HOLIDAY_SUCCESS';
export const CREATE_HOLIDAY_FAILURE = '[HOLIDAY_CREATE] CREATE_HOLIDAY_FAILURE';
export const CREATE_HOLIDAY_RESET = '[HOLIDAY_CREATE] CREATE_HOLIDAY_RESET';

export class CreateHoliday implements Action {
  readonly type = CREATE_HOLIDAY;

  constructor(public payload?: any) {
  }
}

export class CreateHolidayLoading implements Action {
  readonly type = CREATE_HOLIDAY_LOADING;

  constructor(public payload?: any) {
  }
}

export class CreateHolidaySuccess implements Action {
  readonly type = CREATE_HOLIDAY_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class CreateHolidayFailure implements Action {
  readonly type = CREATE_HOLIDAY_FAILURE;

  constructor(public payload?: any) {
  }
}

export class CreateHolidayReset implements Action {
  readonly type = CREATE_HOLIDAY_RESET;

  constructor(public payload?: any) {
  }
}

export type HolidayCreateActions = CreateHoliday | CreateHolidayLoading | CreateHolidaySuccess | CreateHolidayFailure | CreateHolidayReset;
