import { Action } from '@ngrx/store';

export const LOAD_BOND_EVENTS = '[LOAD_BOND_EVENTS] LOAD_BOND_EVENTS';
export const BOND_EVENTS_LOADING = '[LOAD_BOND_EVENTS] BOND_EVENTS_LOADING';
export const BOND_EVENTS_SUCCESS = '[LOAD_BOND_EVENTS] BOND_EVENTS_SUCCESS';
export const BOND_EVENTS_FAILURE = '[LOAD_BOND_EVENTS] BOND_EVENTS_FAILURE';
export const BOND_EVENTS_RESET = '[LOAD_BOND_EVENTS] BOND_EVENTS_RESET';

export class BondEvents implements Action {
  readonly type = LOAD_BOND_EVENTS;
  constructor(public payload?: any) {
  }
}

export class BondEventsLoading implements Action {
  readonly type = BOND_EVENTS_LOADING;

  constructor(public payload?: any) {
  }
}

export class BondEventsSuccess implements Action {
  readonly type = BOND_EVENTS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class BondEventsFailure implements Action {
  readonly type = BOND_EVENTS_FAILURE;

  constructor(public payload?: any) {
  }
}

export class BondEventsReset implements Action {
  readonly type = BOND_EVENTS_RESET;

  constructor(public payload?: any) {
  }
}

export type BondEventsActions =
  BondEvents
  | BondEventsLoading
  | BondEventsSuccess
  | BondEventsFailure
  | BondEventsReset;
