import { Action } from '@ngrx/store';

export const LOAD_COLLATERALS = '[COLLATERALS_LIST] LOAD_COLLATERALS';
export const LOAD_COLLATERALS_SUCCESS = '[COLLATERALS_LIST] LOAD_COLLATERALS_SUCCESS';
export const LOAD_COLLATERALS_FAILURE = '[COLLATERALS_LIST] LOAD_COLLATERALS_FAILURE';
export const LOADING_COLLATERALS = '[COLLATERALS_LIST] LOADING_COLLATERALS';

export class LoadCollaterals implements Action {
  readonly type = LOAD_COLLATERALS;

  constructor(public payload?: any) {
  }
}

export class LoadingCollaterals implements Action {
  readonly type = LOADING_COLLATERALS;
}

export class LoadCollateralsSuccess implements Action {
  readonly type = LOAD_COLLATERALS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadCollateralsFailure implements Action {
  readonly type = LOAD_COLLATERALS_FAILURE;

  constructor(public payload?: any) {
  }
}

export type LoanAppCollateralsListActions = LoadCollaterals | LoadingCollaterals | LoadCollateralsSuccess | LoadCollateralsFailure;
