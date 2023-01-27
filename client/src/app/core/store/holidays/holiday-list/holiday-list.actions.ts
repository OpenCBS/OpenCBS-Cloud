import { Action } from '@ngrx/store';


export const LOAD_HOLIDAYS = '[HOLIDAY_LIST] LOAD_HOLIDAYS';
export const LOAD_HOLIDAYS_SUCCESS = '[HOLIDAY_LIST] LOAD_HOLIDAYS_SUCCESS';
export const LOAD_HOLIDAYS_FAILURE = '[HOLIDAY_LIST] LOAD_HOLIDAY_FAILURE';
export const LOADING_HOLIDAYS = '[HOLIDAY_LIST] LOADING_HOLIDAYS';

export class LoadHolidays implements Action {
  readonly type = LOAD_HOLIDAYS;
}

export class LoadingHolidays implements Action {
  readonly type = LOADING_HOLIDAYS;
}

export class LoadHolidaysSuccess implements Action {
  readonly type = LOAD_HOLIDAYS_SUCCESS;

  constructor(public payload: any) {
  }
}

export class LoadHolidaysFailure implements Action {
  readonly type = LOAD_HOLIDAYS_FAILURE;

  constructor(public payload: any) {
  }
}


export type HolidayListActions = LoadHolidays | LoadingHolidays | LoadHolidaysSuccess | LoadHolidaysFailure;
