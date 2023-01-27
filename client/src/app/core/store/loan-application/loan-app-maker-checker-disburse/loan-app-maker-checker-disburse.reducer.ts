import { ActionReducer } from '@ngrx/store';
import * as fromLoanAppMakerChecker from './loan-app-maker-checker-disburse.actions';

export interface ILoanAppMakerCheckerDisburseState {
  loanApplication: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialLoanApplicationState: ILoanAppMakerCheckerDisburseState = {
  loanApplication: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanAppMakerCheckerDisburseReducer(state = initialLoanApplicationState,
                                                   action: fromLoanAppMakerChecker.LoanAppMakerCheckerDisburseActions) {
  switch (action.type) {
    case fromLoanAppMakerChecker.LOADING_LOAN_APP_MAKER_CHECKER_DISBURSE:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanAppMakerChecker.LOAD_LOAN_APP_MAKER_CHECKER_DISBURSE_SUCCESS:
      return {
        loanApplication: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      };
    case fromLoanAppMakerChecker.LOAD_LOAN_APP_MAKER_CHECKER_DISBURSE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting loan application Maker/Checker for Disburse'
      });
    case fromLoanAppMakerChecker.RESET_LOAN_APP_MAKER_CHECKER_DISBURSE:
      return initialLoanApplicationState;
    default:
      return state;
  }
};
