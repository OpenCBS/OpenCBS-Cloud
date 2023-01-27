import { Action } from '@ngrx/store';

export const UPDATE_LOCATION = '[LOCATION_UPDATE] UPDATE_LOCATION';
export const UPDATE_LOCATION_LOADING = '[LOCATION_UPDATE] UPDATE_LOCATION_LOADING';
export const UPDATE_LOCATION_SUCCESS = '[LOCATION_UPDATE] UPDATE_LOCATION_SUCCESS';
export const UPDATE_LOCATION_FAILURE = '[LOCATION_UPDATE] UPDATE_LOCATION_FAILURE';
export const UPDATE_LOCATION_RESET = '[LOCATION_UPDATE] UPDATE_LOCATION_RESET';

export class UpdateLocation implements Action {
  readonly type = UPDATE_LOCATION;

  constructor(public payload?: any) {
  }
}

export class UpdateLocationLoading implements Action {
  readonly type = UPDATE_LOCATION_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdateLocationSuccess implements Action {
  readonly type = UPDATE_LOCATION_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateLocationFailure implements Action {
  readonly type = UPDATE_LOCATION_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateLocationReset implements Action {
  readonly type = UPDATE_LOCATION_RESET;

  constructor(public payload?: any) {
  }
}

export type LocationUpdateActions =
  UpdateLocation
  | UpdateLocationLoading
  | UpdateLocationSuccess
  | UpdateLocationFailure
  | UpdateLocationReset;
