import { Action } from '@ngrx/store';

export const LOAD_COLLATERAL = '[COLLATERAL] LOAD_COLLATERAL';
export const LOADING_COLLATERAL = '[COLLATERAL] LOADING_COLLATERAL';
export const LOAD_COLLATERAL_SUCCESS = '[COLLATERAL] LOAD_COLLATERAL_SUCCESS';
export const LOAD_COLLATERAL_FAILURE = '[COLLATERAL] LOAD_COLLATERAL_FAILURE';
export const RESET_COLLATERAL = '[COLLATERAL] RESET_COLLATERAL';

export class LoadCollateral implements Action {
  readonly type = LOAD_COLLATERAL;

  constructor(public payload?: any) {
  }
}

export class LoadingCollateral implements Action {
  readonly type = LOADING_COLLATERAL;
}

export class LoadCollateralSuccess implements Action {
  readonly type = LOAD_COLLATERAL_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadCollateralFailure implements Action {
  readonly type = LOAD_COLLATERAL_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetCollateral implements Action {
  readonly type = RESET_COLLATERAL;
}

export type LoanAppCollateralActions = LoadCollateral | LoadingCollateral | LoadCollateralSuccess | LoadCollateralFailure | ResetCollateral;
