import { ActionReducer } from '@ngrx/store';
import * as fromLoanPurposeCreate from './loan-purpose-create.actions';

export interface CreateLoanPurposeState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreateLoanPurposeState: CreateLoanPurposeState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanPurposeCreateReducer(state = initialCreateLoanPurposeState,
                                         action: fromLoanPurposeCreate.LoanPurposeCreateActions) {
  switch (action.type) {
    case fromLoanPurposeCreate.CREATE_LOAN_PURPOSE_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanPurposeCreate.CREATE_LOAN_PURPOSE_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanPurposeCreate.CREATE_LOAN_PURPOSE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new loan purpose data'
      });
    case fromLoanPurposeCreate.CREATE_LOAN_PURPOSE_RESET:
      return initialCreateLoanPurposeState;
    default:
      return state;
  }
};
