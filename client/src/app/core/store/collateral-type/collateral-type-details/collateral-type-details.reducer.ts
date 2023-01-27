import { ActionReducer } from '@ngrx/store';
import * as fromCollateralInfo from './collateral-type-details.actions'
import { CustomFieldMeta } from '../../../models/customField.model';


export interface CollateralTypeDetails {
  id: number;
  caption: string;
  customFields: CustomFieldMeta[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;

}

const initial: CollateralTypeDetails = {
  id: -1,
  caption: '',
  customFields: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function collateralTypeDetailsReducer(state = initial, action: fromCollateralInfo.CollateralTypeDetailsActions) {
  switch (action.type) {
    case fromCollateralInfo.LOAD_COLLATERAL_TYPE_DETAILS_SUCCESS:
      const collateralTypeDetails = action.payload;
      return Object.assign({}, state, {
        id: collateralTypeDetails.id,
        caption: collateralTypeDetails.caption,
        customFields: collateralTypeDetails.customFields,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromCollateralInfo.LOADING_COLLATERAL_TYPE_DETAILS:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromCollateralInfo.LOAD_COLLATERAL_TYPE_DETAILS_FAILURE:
      return Object.assign({}, state, {
        id: -1,
        caption: '',
        customFields: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message
      });
    case fromCollateralInfo.RESET_COLLATERAL_TYPE_DETAILS:
      return initial;
    default:
      return state;
  }
};
