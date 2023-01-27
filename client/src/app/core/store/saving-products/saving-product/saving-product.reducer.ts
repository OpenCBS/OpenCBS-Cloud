import * as fromSavingProduct from './saving-product.actions';

export interface SavingProductState {
  savingProduct: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialSavingProductState: SavingProductState = {
  savingProduct: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function savingProductReducer(state = initialSavingProductState,
                                     action: fromSavingProduct.SavingProductActions) {
  switch (action.type) {
    case fromSavingProduct.LOADING_SAVING_PRODUCT:
      return Object.assign({}, state, {
        loading: true
      });
    case fromSavingProduct.LOAD_SAVING_PRODUCT_SUCCESS:
      return Object.assign({}, state, {
        savingProduct: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromSavingProduct.SAVING_PRODUCT_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromSavingProduct.LOAD_SAVING_PRODUCT_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting saving product'
      });
    case fromSavingProduct.RESET_SAVING_PRODUCT:
      return initialSavingProductState;
    default:
      return state;
  }
};
