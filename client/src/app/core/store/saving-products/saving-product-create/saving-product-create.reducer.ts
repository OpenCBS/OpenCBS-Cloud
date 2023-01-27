import { ActionReducer } from '@ngrx/store';
import * as fromSavingProductCreate from './saving-product-create.actions';

export interface CreateSavingProductState {
  data: any;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreateSavingProductState: CreateSavingProductState = {
  data: null,
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function savingProductCreateReducer(state = initialCreateSavingProductState,
                                           action: fromSavingProductCreate.SavingProductCreateActions) {
  switch (action.type) {
    case fromSavingProductCreate.CREATE_SAVING_PRODUCT_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromSavingProductCreate.CREATE_SAVING_PRODUCT_SUCCESS:
      return Object.assign({}, state, {
        data: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromSavingProductCreate.CREATE_SAVING_PRODUCT_FAILURE:
      return Object.assign({}, state, {
        data: null,
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new saving product data'
      });
    case fromSavingProductCreate.CREATE_SAVING_PRODUCT_RESET:
      return initialCreateSavingProductState;
    default:
      return state;
  }
}
