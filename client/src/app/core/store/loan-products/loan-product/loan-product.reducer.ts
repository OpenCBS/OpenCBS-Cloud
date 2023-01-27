import * as fromLoanProduct from './loan-product.actions';


export interface LoanProductState {
  loanProduct: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialLoanProductState: LoanProductState = {
  loanProduct: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function loanProductReducer(state = initialLoanProductState,
                                   action: fromLoanProduct.LoanProductActions) {
  switch (action.type) {
    case fromLoanProduct.LOADING_LOAN_PRODUCT:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanProduct.LOAD_LOAN_PRODUCT_SUCCESS:
      return Object.assign({}, state, {
        loanProduct: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanProduct.LOAN_PRODUCT_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromLoanProduct.LOAD_LOAN_PRODUCT_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting loan product'
      });
    case fromLoanProduct.RESET_LOAN_PRODUCT:
      return initialLoanProductState;
    default:
      return state;
  }
};
