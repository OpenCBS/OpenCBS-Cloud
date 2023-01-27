import * as fromLoanProductMakerChecker from './loan-product-maker-checker.actions';


export interface LoanProductMakerCheckerState {
  loanProduct: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialLoanProductMakerCheckerState: LoanProductMakerCheckerState = {
  loanProduct: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function loanProductMakerCheckerReducer(state = initialLoanProductMakerCheckerState,
                                               action: fromLoanProductMakerChecker.LoanProductMakerCheckerActions) {
  switch (action.type) {
    case fromLoanProductMakerChecker.LOADING_LOAN_PRODUCT_MAKER_CHECKER:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanProductMakerChecker.LOAD_LOAN_PRODUCT_MAKER_CHECKER_SUCCESS:
      return Object.assign({}, state, {
        loanProduct: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanProductMakerChecker.LOAN_PRODUCT_MAKER_CHECKER_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromLoanProductMakerChecker.LOAD_LOAN_PRODUCT_MAKER_CHECKER_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting loan product maker/checker'
      });
    case fromLoanProductMakerChecker.RESET_LOAN_PRODUCT_MAKER_CHECKER:
      return initialLoanProductMakerCheckerState;
    default:
      return state;
  }
};
