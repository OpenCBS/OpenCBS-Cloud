import * as fromTermDepositProductMakerChecker from './term-deposit-product-maker-checker.actions';


export interface TermDepositProductMakerCheckerState {
  termDepositProduct: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialTermDepositProductMakerCheckerState: TermDepositProductMakerCheckerState = {
  termDepositProduct: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function termDepositProductMakerCheckerReducer(state = initialTermDepositProductMakerCheckerState,
                                                      action: fromTermDepositProductMakerChecker.TermDepositProductMakerCheckerActions) {
  switch (action.type) {
    case fromTermDepositProductMakerChecker.LOADING_TERM_DEPOSIT_PRODUCT_MAKER_CHECKER:
      return Object.assign({}, state, {
        loading: true
      });
    case fromTermDepositProductMakerChecker.LOAD_TERM_DEPOSIT_PRODUCT_MAKER_CHECKER_SUCCESS:
      return Object.assign({}, state, {
        termDepositProduct: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromTermDepositProductMakerChecker.TERM_DEPOSIT_PRODUCT_MAKER_CHECKER_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromTermDepositProductMakerChecker.LOAD_TERM_DEPOSIT_PRODUCT_MAKER_CHECKER_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting term deposit product maker/checker'
      });
    case fromTermDepositProductMakerChecker.RESET_TERM_DEPOSIT_PRODUCT_MAKER_CHECKER:
      return initialTermDepositProductMakerCheckerState;
    default:
      return state;
  }
}
