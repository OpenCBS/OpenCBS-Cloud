import { Action } from '@ngrx/store';

export const LOAD_PENALTIES = '[PENALTIES] LOAD_PENALTIES';
export const LOAD_PENALTIES_SUCCESS = '[PENALTIES] LOAD_PENALTIES_SUCCESS';
export const LOAD_PENALTIES_FAILURE = '[PENALTIES] LOAD_PENALTIES_FAILURE';
export const LOADING_PENALTIES = '[PENALTIES] LOADING_PENALTIES';
export const PENALTIES_RESET = '[PENALTIES] PENALTIES_RESET';

export class LoadPenalties implements Action {
  readonly type = LOAD_PENALTIES;

  constructor(public payload?: any) {
  }
}

export class LoadingPenalties implements Action {
  readonly type = LOADING_PENALTIES;

  constructor(public payload?: any) {
  }
}

export class LoadPenaltiesSuccess implements Action {
  readonly type = LOAD_PENALTIES_SUCCESS;

  constructor(public payload: any) {
  }
}

export class LoadPenaltiesFailure implements Action {
  readonly type = LOAD_PENALTIES_FAILURE;

  constructor(public payload: any) {
  }
}

export class PenaltiesReset implements Action {
  readonly type = PENALTIES_RESET;
}

export type PenaltiesActions =
  LoadPenalties
  | LoadingPenalties
  | LoadPenaltiesSuccess
  | LoadPenaltiesFailure
  | PenaltiesReset;
