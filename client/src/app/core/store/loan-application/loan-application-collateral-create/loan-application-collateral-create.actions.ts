import { Action } from '@ngrx/store';

export const CREATE_COLLATERAL = '[COLLATERAL_CREATE] CREATE_COLLATERAL';
export const CREATE_COLLATERAL_LOADING = '[COLLATERAL_CREATE] CREATE_COLLATERAL_LOADING';
export const CREATE_COLLATERAL_SUCCESS = '[COLLATERAL_CREATE] CREATE_COLLATERAL_SUCCESS';
export const CREATE_COLLATERAL_FAILURE = '[COLLATERAL_CREATE] CREATE_COLLATERAL_FAILURE';
export const CREATE_COLLATERAL_RESET = '[COLLATERAL_CREATE] CREATE_COLLATERAL_RESET';

export class CreateCollateral implements Action {
  readonly type = CREATE_COLLATERAL;

  constructor(public payload: any) {
  }
}

export class CreateCollateralLoading implements Action {
  readonly type = CREATE_COLLATERAL_LOADING;
}

export class CreateCollateralSuccess implements Action {
  readonly type = CREATE_COLLATERAL_SUCCESS;

  constructor(public payload: any) {
  }
}

export class CreateCollateralFailure implements Action {
  readonly type = CREATE_COLLATERAL_FAILURE;

  constructor(public payload: any) {
  }
}

export class CreateCollateralReset implements Action {
  readonly type = CREATE_COLLATERAL_RESET;
}

export type LoanAppCollateralCreateActions =
  CreateCollateral
  | CreateCollateralLoading
  | CreateCollateralSuccess
  | CreateCollateralFailure
  | CreateCollateralReset;
