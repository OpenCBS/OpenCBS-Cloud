import { ActionReducer } from '@ngrx/store';
import * as fromLoanPurposeUpdate from './loan-purpose-update.actions';

export interface UpdateLoanPurposeState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateLoanPurposeState: UpdateLoanPurposeState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanPurposeUpdateReducer(state = initialUpdateLoanPurposeState,
                                         action: fromLoanPurposeUpdate.LoanPurposeUpdateActions) {
  switch (action.type) {
    case fromLoanPurposeUpdate.UPDATE_LOAN_PURPOSE_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanPurposeUpdate.UPDATE_LOAN_PURPOSE_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanPurposeUpdate.UPDATE_LOAN_PURPOSE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new loan purpose data'
      });
    case fromLoanPurposeUpdate.UPDATE_LOAN_PURPOSE_RESET:
      return initialUpdateLoanPurposeState;
    default:
      return state;
  }
};
