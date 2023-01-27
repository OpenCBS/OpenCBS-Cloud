import { Action } from '@ngrx/store';

export const LOAD_LOCATIONS = '[LOCATION_LIST] LOAD_LOCATIONS';
export const LOADING_LOCATIONS = '[LOCATION_LIST] LOADING_LOCATIONS';
export const LOAD_LOCATIONS_SUCCESS = '[LOCATION_LIST] LOAD_LOCATIONS_SUCCESS';
export const LOAD_LOCATIONS_FAILURE = '[LOCATION_LIST] LOAD_LOCATIONS_FAILURE';

export class LoadLocations implements Action {
  readonly type = LOAD_LOCATIONS;

  constructor(public payload?: any) {
  }
}

export class LoadingLocations implements Action {
  readonly type = LOADING_LOCATIONS;

  constructor(public payload?: any) {
  }
}

export class LoadLocationsSuccess implements Action {
  readonly type = LOAD_LOCATIONS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadLocationsFailure implements Action {
  readonly type = LOAD_LOCATIONS_FAILURE;

  constructor(public payload?: any) {
  }
}

export type LocationListActions = LoadLocations | LoadingLocations | LoadLocationsSuccess | LoadLocationsFailure;
