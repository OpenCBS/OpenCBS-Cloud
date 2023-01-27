import { ActionReducer } from '@ngrx/store';
import * as fromLoanPurposeList from './loan-purpose-list.actions';

export interface LoanPurposeListState {
  loan_purposes: any[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialLoanPurposeState: LoanPurposeListState = {
  loan_purposes: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanPurposeListReducer(state = initialLoanPurposeState,
                                       action: fromLoanPurposeList.LoanPurposeListActions) {
  switch (action.type) {
    case fromLoanPurposeList.LOADING_LOAN_PURPOSES:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanPurposeList.LOAD_LOAN_PURPOSES_SUCCESS:
      return Object.assign({}, state, {
        loan_purposes: action.payload,
        loaded: true,
        loading: false,
        error: false,
        errorMessage: ''
      });
    case fromLoanPurposeList.LOAD_LOAN_PURPOSES_FAILURE:
      return Object.assign({}, state, {
        loan_purposes: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting loan purpose list'
      });
    default:
      return state;
  }
};
