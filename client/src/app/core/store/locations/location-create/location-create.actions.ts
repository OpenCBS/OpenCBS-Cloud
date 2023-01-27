import { Action } from '@ngrx/store';

export const CREATE_LOCATION = '[LOCATION_CREATE] CREATE_LOCATION';
export const CREATE_LOCATION_LOADING = '[LOCATION_CREATE] CREATE_LOCATION_LOADING';
export const CREATE_LOCATION_SUCCESS = '[LOCATION_CREATE] CREATE_LOCATION_SUCCESS';
export const CREATE_LOCATION_FAILURE = '[LOCATION_CREATE] CREATE_LOCATION_FAILURE';
export const CREATE_LOCATION_RESET = '[LOCATION_CREATE] CREATE_LOCATION_RESET';

export class CreateLocation implements Action {
  readonly type = CREATE_LOCATION;

  constructor(public payload?: any) {
  }
}

export class CreateLocationLoading implements Action {
  readonly type = CREATE_LOCATION_LOADING;

  constructor(public payload?: any) {
  }
}

export class CreateLocationSuccess implements Action {
  readonly type = CREATE_LOCATION_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class CreateLocationFailure implements Action {
  readonly type = CREATE_LOCATION_FAILURE;

  constructor(public payload?: any) {
  }
}

export class CreateLocationReset implements Action {
  readonly type = CREATE_LOCATION_RESET;

  constructor(public payload?: any) {
  }
}

export type LocationCreateActions =
  CreateLocation
  | CreateLocationLoading
  | CreateLocationSuccess
  | CreateLocationFailure
  | CreateLocationReset;
