import { Action } from '@ngrx/store';

export const LOAD_PROFILE_EVENTS = '[PROFILE_EVENTS] LOAD_PROFILE_EVENTS';
export const LOADING_PROFILE_EVENTS = '[PROFILE_EVENTS] LOADING_PROFILE_EVENTS';
export const LOAD_PROFILE_EVENTS_SUCCESS = '[PROFILE_EVENTS] LOAD_PROFILE_EVENTS_SUCCESS';
export const LOAD_PROFILE_EVENTS_FAILURE = '[PROFILE_EVENTS] LOAD_PROFILE_EVENTS_FAILURE';

export class LoadProfileEventsList implements Action {
  readonly type = LOAD_PROFILE_EVENTS;

  constructor(public payload?: any) {
  }
}

export class LoadingProfileEventsList implements Action {
  readonly type = LOADING_PROFILE_EVENTS;

  constructor(public payload?: any) {
  }
}

export class LoadProfileEventsListSuccess implements Action {
  readonly type = LOAD_PROFILE_EVENTS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadProfileEventsListFail implements Action {
  readonly type = LOAD_PROFILE_EVENTS_FAILURE;

  constructor(public payload?: any) {
  }
}

export type ProfileEventsListActions =
  LoadProfileEventsList
  | LoadingProfileEventsList
  | LoadProfileEventsListSuccess
  | LoadProfileEventsListFail;
