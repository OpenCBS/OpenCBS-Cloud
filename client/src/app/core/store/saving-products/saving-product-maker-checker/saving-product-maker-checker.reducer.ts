import * as fromSavingProductMakerChecker from './saving-product-maker-checker.actions';

export interface SavingProductMakerCheckerState {
  savingProduct: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialSavingProductMakerCheckerState: SavingProductMakerCheckerState = {
  savingProduct: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function savingProductMakerCheckerReducer(state = initialSavingProductMakerCheckerState,
                                                 action: fromSavingProductMakerChecker.SavingProductMakerCheckerActions) {
  switch (action.type) {
    case fromSavingProductMakerChecker.LOADING_SAVING_PRODUCT_MAKER_CHECKER:
      return Object.assign({}, state, {
        loading: true
      });
    case fromSavingProductMakerChecker.LOAD_SAVING_PRODUCT_MAKER_CHECKER_SUCCESS:
      return Object.assign({}, state, {
        savingProduct: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromSavingProductMakerChecker.SAVING_PRODUCT_MAKER_CHECKER_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromSavingProductMakerChecker.LOAD_SAVING_PRODUCT_MAKER_CHECKER_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting saving product maker/checker'
      });
    case fromSavingProductMakerChecker.RESET_SAVING_PRODUCT_MAKER_CHECKER:
      return initialSavingProductMakerCheckerState;
    default:
      return state;
  }
};
