import { ActionReducer } from '@ngrx/store';
import * as fromLoanPayeeUpdate from './loan-payee-update.actions';

export interface ILoanPayeeUpdateState {
  response: any;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateLoanPayeeState: ILoanPayeeUpdateState = {
  response: null,
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanPayeeUpdateReducer(state = initialUpdateLoanPayeeState,
                                             action: fromLoanPayeeUpdate.LoanPayeeUpdateActions) {
  switch (action.type) {
    case fromLoanPayeeUpdate.UPDATE_LOAN_PAYEE_LOADING:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromLoanPayeeUpdate.UPDATE_LOAN_PAYEE_SUCCESS:
      return Object.assign({}, state, {
        response: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanPayeeUpdate.UPDATE_LOAN_PAYEE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new loan payee data'
      });
    case fromLoanPayeeUpdate.UPDATE_LOAN_PAYEE_RESET:
      return initialUpdateLoanPayeeState;
    default:
      return state;
  }
};
