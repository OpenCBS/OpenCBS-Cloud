import { Action } from '@ngrx/store';

export const UPDATE_COLLATERAL = '[COLLATERAL_UPDATE] ';
export const UPDATE_COLLATERAL_LOADING = '[COLLATERAL_UPDATE] UPDATE_COLLATERAL_LOADING';
export const UPDATE_COLLATERAL_SUCCESS = '[COLLATERAL_UPDATE] UPDATE_COLLATERAL_SUCCESS';
export const UPDATE_COLLATERAL_FAILURE = '[COLLATERAL_UPDATE] UPDATE_COLLATERAL_FAILURE';
export const UPDATE_COLLATERAL_RESET = '[COLLATERAL_UPDATE] UPDATE_COLLATERAL_RESET';

export class UpdateCollateral implements Action {
  readonly type = UPDATE_COLLATERAL;

  constructor(public payload: any) {
  }
}

export class UpdateCollateralLoading implements Action {
  readonly type = UPDATE_COLLATERAL_LOADING;
}

export class UpdateCollateralSuccess implements Action {
  readonly type = UPDATE_COLLATERAL_SUCCESS;

  constructor(public payload: any) {
  }
}

export class UpdateCollateralFailure implements Action {
  readonly type = UPDATE_COLLATERAL_FAILURE;

  constructor(public payload: any) {
  }
}

export class UpdateCollateralReset implements Action {
  readonly type = UPDATE_COLLATERAL_RESET;
}

export type LoanAppCollateralUpdateActions =
  UpdateCollateral
  | UpdateCollateralLoading
  | UpdateCollateralSuccess
  | UpdateCollateralFailure
  | UpdateCollateralReset;
