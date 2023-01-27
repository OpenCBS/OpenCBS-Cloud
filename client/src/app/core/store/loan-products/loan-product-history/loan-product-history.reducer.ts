import * as fromLoanProductHistory from './loan-product-history.actions';


export interface LoanProductHistoryState {
  loanProductHistory: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialLoanProductHistoryState: LoanProductHistoryState = {
  loanProductHistory: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function loanProductHistoryReducer(state = initialLoanProductHistoryState,
                                   action: fromLoanProductHistory.LoanProductHistoryActions) {
  switch (action.type) {
    case fromLoanProductHistory.LOADING_LOAN_PRODUCT_HISTORY:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanProductHistory.LOAD_LOAN_PRODUCT_HISTORY_SUCCESS:
      return Object.assign({}, state, {
        loanProductHistory: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanProductHistory.LOAN_PRODUCT_HISTORY_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromLoanProductHistory.LOAD_LOAN_PRODUCT_HISTORY_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting loan product history'
      });
    case fromLoanProductHistory.RESET_LOAN_PRODUCT_HISTORY:
      return initialLoanProductHistoryState;
    default:
      return state;
  }
};
