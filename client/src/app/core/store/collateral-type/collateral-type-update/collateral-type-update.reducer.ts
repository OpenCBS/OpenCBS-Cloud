import { ActionReducer } from '@ngrx/store';
import * as fromCollateralTypeUpdate from './collateral-type-update.actions'


export interface UpdateCollateralTypeState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateCollateralTypeState: UpdateCollateralTypeState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function collateralTypeUpdateReducer(state = initialUpdateCollateralTypeState,
                                            action: fromCollateralTypeUpdate.CollateralTypeUpdateActions) {
  switch (action.type) {
    case fromCollateralTypeUpdate.UPDATE_COLLATERAL_TYPE_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromCollateralTypeUpdate.UPDATE_COLLATERAL_TYPE_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromCollateralTypeUpdate.UPDATE_COLLATERAL_TYPE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new collateralType data'
      });
    case fromCollateralTypeUpdate.UPDATE_COLLATERAL_TYPE_RESET:
      return initialUpdateCollateralTypeState;
    default:
      return state;
  }
};
