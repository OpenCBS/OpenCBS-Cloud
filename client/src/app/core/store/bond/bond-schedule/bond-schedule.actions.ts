import { Action } from '@ngrx/store';

export const LOAD_BOND_SCHEDULE = '[BOND_SCHEDULE] LOAD_BOND_SCHEDULE';
export const LOADING_BOND_SCHEDULE = '[BOND_SCHEDULE] LOADING_BOND_SCHEDULE';
export const LOAD_BOND_SCHEDULE_SUCCESS = '[BOND_SCHEDULE] LOAD_BOND_SCHEDULE_SUCCESS';
export const LOAD_BOND_SCHEDULE_FAILURE = '[BOND_SCHEDULE] LOAD_BOND_SCHEDULE_FAILURE';
export const RESET_BOND_SCHEDULE = '[BOND_SCHEDULE] RESET_BOND_SCHEDULE';
export const LOAD_ACTIVE_BOND_SCHEDULE = '[BOND_SCHEDULE] LOAD_ACTIVE_BOND_SCHEDULE';

export class LoadBondSchedule implements Action {
  readonly type = LOAD_BOND_SCHEDULE;

  constructor(public payload?: any) {
  }
}

export class LoadActiveBondSchedule implements Action {
  readonly type = LOAD_ACTIVE_BOND_SCHEDULE;

  constructor(public payload?: any) {
  }
}

export class LoadingBondSchedule implements Action {
  readonly type = LOADING_BOND_SCHEDULE;

  constructor(public payload?: any) {
  }
}

export class LoadBondScheduleSuccess implements Action {
  readonly type = LOAD_BOND_SCHEDULE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadBondScheduleFailure implements Action {
  readonly type = LOAD_BOND_SCHEDULE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetBondSchedule implements Action {
  readonly type = RESET_BOND_SCHEDULE;
}

export type BondScheduleActions =
  LoadBondSchedule
  | LoadingBondSchedule
  | LoadBondScheduleSuccess
  | LoadBondScheduleFailure
  | ResetBondSchedule
  | LoadActiveBondSchedule;
