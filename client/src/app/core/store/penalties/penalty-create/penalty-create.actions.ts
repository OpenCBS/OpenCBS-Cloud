import { Action } from '@ngrx/store';

export const CREATE_PENALTY = '[PENALTY_CREATE] CREATE_PENALTY';
export const CREATE_PENALTY_LOADING = '[PENALTY_CREATE] CREATE_PENALTY_LOADING';
export const CREATE_PENALTY_SUCCESS = '[PENALTY_CREATE] CREATE_PENALTY_SUCCESS';
export const CREATE_PENALTY_FAILURE = '[PENALTY_CREATE] CREATE_PENALTY_FAILURE';
export const CREATE_PENALTY_RESET = '[PENALTY_CREATE] CREATE_PENALTY_RESET';

export class CreatePenalty implements Action {
  readonly type = CREATE_PENALTY;

  constructor(public payload: any) {
  }
}

export class CreatePenaltyLoading implements Action {
  readonly type = CREATE_PENALTY_LOADING;
}

export class CreatePenaltySuccess implements Action {
  readonly type = CREATE_PENALTY_SUCCESS;
}

export class CreatePenaltyFailure implements Action {
  readonly type = CREATE_PENALTY_FAILURE;

  constructor(public payload: any) {
  }
}

export class CreatePenaltyReset implements Action {
  readonly type = CREATE_PENALTY_RESET;
}


export type PenaltyCreateActions =
  CreatePenalty
  | CreatePenaltyLoading
  | CreatePenaltySuccess
  | CreatePenaltyFailure
  | CreatePenaltyReset;
