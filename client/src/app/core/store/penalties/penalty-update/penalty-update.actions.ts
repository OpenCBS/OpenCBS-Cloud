import { Action } from '@ngrx/store';

export const UPDATE_PENALTY = '[PENALTY_UPDATE] UPDATE_PENALTY';
export const UPDATE_PENALTY_LOADING = '[PENALTY_UPDATE] UPDATE_PENALTY_LOADING';
export const UPDATE_PENALTY_SUCCESS = '[PENALTY_UPDATE] UPDATE_PENALTY_SUCCESS';
export const UPDATE_PENALTY_FAILURE = '[PENALTY_UPDATE] UPDATE_PENALTY_FAILURE';
export const UPDATE_PENALTY_RESET = '[PENALTY_UPDATE] UPDATE_PENALTY_RESET';

export class UpdatePenalty implements Action {
  readonly type = UPDATE_PENALTY;

  constructor(public payload?: any) {
  }
}

export class UpdatePenaltyLoading implements Action {
  readonly type = UPDATE_PENALTY_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdatePenaltySuccess implements Action {
  readonly type = UPDATE_PENALTY_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdatePenaltyFailure implements Action {
  readonly type = UPDATE_PENALTY_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdatePenaltyReset implements Action {
  readonly type = UPDATE_PENALTY_RESET;

  constructor(public payload?: any) {
  }
}

export type PenaltyUpdateActions =
  UpdatePenalty
  | UpdatePenaltyLoading
  | UpdatePenaltySuccess
  | UpdatePenaltyFailure
  | UpdatePenaltyReset;
