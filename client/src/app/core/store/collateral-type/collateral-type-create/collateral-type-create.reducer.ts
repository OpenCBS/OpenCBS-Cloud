import { ActionReducer } from '@ngrx/store';
import * as fromCollateralTypeCreate from './collateral-type-create.actions'

export interface CreateCollateralTypeState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreateCollateralTypeState: CreateCollateralTypeState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function collateralTypeCreateReducer(state = initialCreateCollateralTypeState,
                                            action: fromCollateralTypeCreate.CollateralTypeCreateActions) {
  switch (action.type) {
    case fromCollateralTypeCreate.CREATE_COLLATERAL_TYPE_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromCollateralTypeCreate.CREATE_COLLATERAL_TYPE_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromCollateralTypeCreate.CREATE_COLLATERAL_TYPE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new collateral product data'
      });
    case fromCollateralTypeCreate.CREATE_COLLATERAL_TYPE_RESET:
      return initialCreateCollateralTypeState;
    default:
      return state;
  }
};
