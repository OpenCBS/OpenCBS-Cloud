import { Action } from '@ngrx/store';

export const CREATE_COLLATERAL_TYPE = '[COLLATERAL_TYPE_CREATE] CREATE_COLLATERAL_TYPE';
export const CREATE_COLLATERAL_TYPE_LOADING = '[COLLATERAL_TYPE_CREATE] CREATE_COLLATERAL_TYPE_LOADING';
export const CREATE_COLLATERAL_TYPE_SUCCESS = '[COLLATERAL_TYPE_CREATE] CREATE_COLLATERAL_TYPE_SUCCESS';
export const CREATE_COLLATERAL_TYPE_FAILURE = '[COLLATERAL_TYPE_CREATE] CREATE_COLLATERAL_TYPE_FAILURE';
export const CREATE_COLLATERAL_TYPE_RESET = '[COLLATERAL_TYPE_CREATE] CREATE_COLLATERAL_TYPE_RESET';

export class CreateCollateralType implements Action {
  readonly type = CREATE_COLLATERAL_TYPE;

  constructor(public payload: any) {
  }
}

export class CreateCollateralTypeLoading implements Action {
  readonly type = CREATE_COLLATERAL_TYPE_LOADING;
}

export class CreateCollateralTypeSuccess implements Action {
  readonly type = CREATE_COLLATERAL_TYPE_SUCCESS;
}

export class CreateCollateralTypeFailure implements Action {
  readonly type = CREATE_COLLATERAL_TYPE_FAILURE;

  constructor(public payload: any) {
  }
}

export class CreateCollateralTypeReset implements Action {
  readonly type = CREATE_COLLATERAL_TYPE_RESET;
}

export type CollateralTypeCreateActions =
  CreateCollateralType
  | CreateCollateralTypeLoading
  | CreateCollateralTypeSuccess
  | CreateCollateralTypeFailure
  | CreateCollateralTypeReset;

