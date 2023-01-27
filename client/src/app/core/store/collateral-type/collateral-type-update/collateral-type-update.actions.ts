import { Action } from '@ngrx/store';

export const UPDATE_COLLATERAL_TYPE = '[COLLATERAL_TYPE_UPDATE] UPDATE_COLLATERAL_TYPE';
export const UPDATE_COLLATERAL_TYPE_LOADING = '[COLLATERAL_TYPE_UPDATE] UPDATE_COLLATERAL_TYPE_LOADING';
export const UPDATE_COLLATERAL_TYPE_SUCCESS = '[COLLATERAL_TYPE_UPDATE] UPDATE_COLLATERAL_TYPE_SUCCESS';
export const UPDATE_COLLATERAL_TYPE_FAILURE = '[COLLATERAL_TYPE_UPDATE] UPDATE_COLLATERAL_TYPE_FAILURE';
export const UPDATE_COLLATERAL_TYPE_RESET = '[COLLATERAL_TYPE_UPDATE] UPDATE_COLLATERAL_TYPE_RESET';


export class UpdateCollateralType implements Action {
  readonly type = UPDATE_COLLATERAL_TYPE;

  constructor(public payload: any) {
  }
}

export class UpdateCollateralTypeLoading implements Action {
  readonly type = UPDATE_COLLATERAL_TYPE_LOADING;
}

export class UpdateCollateralTypeSuccess implements Action {
  readonly type = UPDATE_COLLATERAL_TYPE_SUCCESS;
}

export class UpdateCollateralTypeFailure implements Action {
  readonly type = UPDATE_COLLATERAL_TYPE_FAILURE;

  constructor(public payload: any) {
  }
}

export class UpdateCollateralTypeReset implements Action {
  readonly type = UPDATE_COLLATERAL_TYPE_RESET;
}

export type CollateralTypeUpdateActions =
  UpdateCollateralType
  | UpdateCollateralTypeLoading
  | UpdateCollateralTypeSuccess
  | UpdateCollateralTypeFailure
  | UpdateCollateralTypeReset;
