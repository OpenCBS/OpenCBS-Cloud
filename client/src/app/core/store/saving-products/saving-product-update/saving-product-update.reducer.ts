import * as fromSavingProductUpdate from './saving-product-update.actions';
import { ActionReducer } from '@ngrx/store';

export interface UpdateSavingProductState {
  data: any;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateSavingProductState: UpdateSavingProductState = {
  data: null,
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function savingProductUpdateReducer(state = initialUpdateSavingProductState,
                                           action: fromSavingProductUpdate.SavingProductUpdateActions) {
  switch (action.type) {
    case fromSavingProductUpdate.UPDATE_SAVING_PRODUCT_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromSavingProductUpdate.UPDATE_SAVING_PRODUCT_SUCCESS:
      return Object.assign({}, state, {
        data: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromSavingProductUpdate.UPDATE_SAVING_PRODUCT_FAILURE:
      return Object.assign({}, state, {
        data: null,
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving saving product-state data'
      });
    case fromSavingProductUpdate.UPDATE_SAVING_PRODUCT_RESET:
      return initialUpdateSavingProductState;
    default:
      return state;
  }
}
