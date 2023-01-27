import * as fromTermDepositProduct from './term-deposit-product-info.actions';


export interface ITermDepositProductInfo {
  termDepositProduct: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialTermDepositProductState: ITermDepositProductInfo = {
  termDepositProduct: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function termDepositProductInfoReducer(state = initialTermDepositProductState,
                                   action: fromTermDepositProduct.TermDepositProductInfoActions) {
  switch (action.type) {
    case fromTermDepositProduct.LOADING_TERM_DEPOSIT_PRODUCT:
      return Object.assign({}, state, {
        loading: true
      });
    case fromTermDepositProduct.LOAD_TERM_DEPOSIT_PRODUCT_SUCCESS:
      return Object.assign({}, state, {
        termDepositProduct: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromTermDepositProduct.TERM_DEPOSIT_PRODUCT_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromTermDepositProduct.LOAD_TERM_DEPOSIT_PRODUCT_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting term deposit product'
      });
    case fromTermDepositProduct.RESET_TERM_DEPOSIT_PRODUCT:
      return initialTermDepositProductState;
    default:
      return state;
  }
}
