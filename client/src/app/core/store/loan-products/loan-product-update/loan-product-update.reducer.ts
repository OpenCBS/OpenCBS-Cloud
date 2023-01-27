import { ActionReducer } from '@ngrx/store';
import * as fromLoanProductUpdate from './loan-product-update.actions';

export interface UpdateLoanProductState {
  response: any;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateLoanProductState: UpdateLoanProductState = {
  response: null,
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanProductUpdateReducer(state = initialUpdateLoanProductState,
                                         action: fromLoanProductUpdate.LoanProductUpdateActions) {
  switch (action.type) {
    case fromLoanProductUpdate.UPDATE_LOAN_PRODUCT_LOADING:
      return Object.assign({}, state, {
        loading: true,
      });
    case fromLoanProductUpdate.UPDATE_LOAN_PRODUCT_SUCCESS:
      return Object.assign({}, state, {
        response: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanProductUpdate.UPDATE_LOAN_PRODUCT_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving loan product-state data'
      });
    case fromLoanProductUpdate.UPDATE_LOAN_PRODUCT_RESET:
      return initialUpdateLoanProductState;
    default:
      return state;
  }
};
