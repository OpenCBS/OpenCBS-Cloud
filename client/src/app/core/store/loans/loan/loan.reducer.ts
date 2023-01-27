import * as fromLoan from './loan.actions';

export interface ILoanInfo {
  loan: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialLoanInfoState: ILoanInfo = {
  loan: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanInfoReducer(state = initialLoanInfoState, action: fromLoan.LoanInfoActions) {
  switch (action.type) {
    case fromLoan.LOAD_LOAN_INFO:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoan.LOAD_LOAN_INFO_SUCCESS:
      return Object.assign({}, state, {
        loan: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoan.LOAN_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromLoan.LOAD_LOAN_INFO_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting loan'
      });
    case fromLoan.RESET_LOAN_INFO:
      return initialLoanInfoState;
    default:
      return state;
  }
}
