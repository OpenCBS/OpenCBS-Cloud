import { Action } from '@ngrx/store';

export const LOAD_COLLATERAL_TYPE_DETAILS = '[COLLATERAL_TYPE_DETAILS] LOAD_COLLATERAL_TYPE_DETAILS';
export const LOAD_COLLATERAL_TYPE_DETAILS_SUCCESS = '[COLLATERAL_TYPE_DETAILS] LOAD_COLLATERAL_TYPE_DETAILS_SUCCESS';
export const LOAD_COLLATERAL_TYPE_DETAILS_FAILURE = '[COLLATERAL_TYPE_DETAILS] LOAD_COLLATERAL_TYPE_DETAILS_FAILURE';
export const LOADING_COLLATERAL_TYPE_DETAILS = '[COLLATERAL_TYPE_DETAILS] LOADING_COLLATERAL_TYPE_DETAILS';
export const RESET_COLLATERAL_TYPE_DETAILS = '[COLLATERAL_TYPE_DETAILS] RESET_COLLATERAL_TYPE_DETAILS';


export class LoadCollateralType implements Action {
  readonly type = LOAD_COLLATERAL_TYPE_DETAILS;

  constructor(public payload?: number) {
  };
}

export class LoadCollateralTypeSuccess implements Action {
  readonly type = LOAD_COLLATERAL_TYPE_DETAILS_SUCCESS;

  constructor(public payload?: any) {
  };
}

export class LoadCollateralTypeFailure implements Action {
  readonly type = LOAD_COLLATERAL_TYPE_DETAILS_FAILURE;

  constructor(public payload?: any) {
  };
}

export class LoadingCollateralType implements Action {
  readonly type = LOADING_COLLATERAL_TYPE_DETAILS;
}

export class ResetCollateralType implements Action {
  readonly type = RESET_COLLATERAL_TYPE_DETAILS;
}

export type CollateralTypeDetailsActions =
  LoadCollateralType
  | LoadCollateralTypeSuccess
  | LoadCollateralTypeFailure
  | LoadingCollateralType
  | ResetCollateralType;
