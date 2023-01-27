import * as fromLoanProductCreate from './loan-product-create.actions';

export interface CreateLoanProductState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreateLoanProductState: CreateLoanProductState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanProductCreateReducer(state = initialCreateLoanProductState,
                                         action: fromLoanProductCreate.LoanProductCreateActions) {
  switch (action.type) {
    case fromLoanProductCreate.CREATE_LOAN_PRODUCT_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanProductCreate.CREATE_LOAN_PRODUCT_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: '',
        response: action.payload
      });
    case fromLoanProductCreate.CREATE_LOAN_PRODUCT_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new loan product data',
        response: null
      });
    case fromLoanProductCreate.CREATE_LOAN_PRODUCT_RESET:
      return initialCreateLoanProductState;
    default:
      return state;
  }
};
