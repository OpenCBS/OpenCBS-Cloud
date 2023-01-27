import { Action } from '@ngrx/store';

export const LOAD_DAY_CLOSURE = '[DAY_CLOSURE] LOAD_DAY_CLOSURE';
export const SET_DAY_CLOSURE = '[DAY_CLOSURE] SET_DAY_CLOSURE';
export const POPULATE_DAY_CLOSURE = '[DAY_CLOSURE] POPULATE_DAY_CLOSURE';
export const LOAD_DAY_CLOSURE_FAILURE = '[DAY_CLOSURE] LOAD_DAY_CLOSURE_FAILURE';
export const RESET_DAY_CLOSURE = '[DAY_CLOSURE] RESET_DAY_CLOSURE';


export class LoadDayClosure implements Action {
  readonly type = LOAD_DAY_CLOSURE;

  constructor(public payload?: any) {
  }
}

export class LoadDayClosureFailure implements Action {
  readonly type = LOAD_DAY_CLOSURE_FAILURE;

  constructor(public payload?: any) {
  }
}

// Populates all day closure details
export class PopulateDayClosure implements Action {
  readonly type = POPULATE_DAY_CLOSURE;

  constructor(public payload?: any) {
  }
}

export class SetDayClosure implements Action {
  readonly type = SET_DAY_CLOSURE;

  constructor(public payload?: any) {
  }
}

export class ResetDayClosure implements Action {
  readonly type = RESET_DAY_CLOSURE;
}

export type DayClosureActions = LoadDayClosure | SetDayClosure | ResetDayClosure | PopulateDayClosure
