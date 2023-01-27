import { ActionReducer } from '@ngrx/store';
import * as fromCollateralTypeList from './collateral-type-list.actions';


export interface CollateralTypeListState {
  collateralTypes: any[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCollateralTypeListState: CollateralTypeListState = {
  collateralTypes: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: '',
};

export function collateralTypeListReducer(
  state = initialCollateralTypeListState, action: fromCollateralTypeList.CollateralTypeListActions) {
  switch (action.type) {
    case fromCollateralTypeList.LOADING_COLLATERAL_TYPES:
      return Object.assign({}, state, {
        loading: true
      });
    case fromCollateralTypeList.LOAD_COLLATERAL_TYPES_SUCCESS:
      const collateralTypes = action.payload;
      return Object.assign({}, state, {
        collateralTypes: collateralTypes,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromCollateralTypeList.LOAD_COLLATERAL_TYPES_FAILURE:
      return Object.assign({}, state, {
        collateralTypes: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting collateral product list'
      });
    case fromCollateralTypeList.RESET_COLLATERAL_TYPES:
      return initialCollateralTypeListState;
    default:
      return state;
  }
};
