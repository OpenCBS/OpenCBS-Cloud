import { ActionReducer } from '@ngrx/store';
import * as fromLoanMakerCheckerRepayment from './loan-maker-checker-repayment.actions';
import * as fromLoan from '../loan/loan.actions';

export interface ILoanMakerCheckerRepayment {
  loanMakerCheckerRepayment: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialLoanMakerCheckerRepaymentState: ILoanMakerCheckerRepayment = {
  loanMakerCheckerRepayment: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function loanMakerCheckerRepaymentReducer(state = initialLoanMakerCheckerRepaymentState,
                                                 action: fromLoanMakerCheckerRepayment.LoanMakerCheckerRepaymentActions) {
  switch (action.type) {
    case fromLoanMakerCheckerRepayment.LOADING_LOAN_MAKER_CHECKER_REPAYMENT:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanMakerCheckerRepayment.LOAD_LOAN_MAKER_CHECKER_REPAYMENT_SUCCESS:
      return Object.assign({}, state, {
        loanMakerCheckerRepayment: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanMakerCheckerRepayment.LOAD_LOAN_MAKER_CHECKER_REPAYMENT_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting loan maker checker repayment'
      });
    case fromLoanMakerCheckerRepayment.RESET_LOAN_MAKER_CHECKER_REPAYMENT:
      return initialLoanMakerCheckerRepaymentState;
    default:
      return state;
  }
}
