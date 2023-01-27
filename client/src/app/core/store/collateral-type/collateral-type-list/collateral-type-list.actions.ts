import { Action } from '@ngrx/store';

export const LOAD_COLLATERAL_TYPES = '[COLLATERAL_TYPE_LIST] LOAD_COLLATERAL_TYPES';
export const LOAD_COLLATERAL_TYPES_SUCCESS = '[COLLATERAL_TYPE_LIST] LOAD_COLLATERAL_TYPES_SUCCESS';
export const LOAD_COLLATERAL_TYPES_FAILURE = '[COLLATERAL_TYPE_LIST] LOAD_COLLATERAL_TYPE_FAILURE';
export const LOADING_COLLATERAL_TYPES = '[COLLATERAL_TYPE_LIST] LOADING_COLLATERAL_TYPES';
export const RESET_COLLATERAL_TYPES = '[COLLATERAL_TYPE_LIST] RESET_COLLATERAL_TYPES';

export class LoadCollateralTypes implements Action {
  readonly type = LOAD_COLLATERAL_TYPES;
}

export class LoadingCollateralTypes implements Action {
  readonly type = LOADING_COLLATERAL_TYPES;
}

export class LoadCollateralTypesSuccess implements Action {
  readonly type = LOAD_COLLATERAL_TYPES_SUCCESS;

  constructor(public payload?: any) {
  };
}

export class LoadCollateralTypesFailure implements Action {
  readonly type = LOAD_COLLATERAL_TYPES_FAILURE;

  constructor(public payload?: any) {
  };
}

export class ResetCollateralTypes implements Action {
  readonly type = RESET_COLLATERAL_TYPES;
}

export type CollateralTypeListActions =
  LoadCollateralTypes
  | LoadingCollateralTypes
  | LoadCollateralTypesSuccess
  | LoadCollateralTypesFailure
  | ResetCollateralTypes;
