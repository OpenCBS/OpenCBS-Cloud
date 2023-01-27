import * as fromLoanPayee from './loan-payee.actions';

export interface ILoanPayee {
  payee: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialLoanPayeeState: ILoanPayee = {
  payee: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanPayeeReducer(state = initialLoanPayeeState, action: fromLoanPayee.LoanPayeeActions) {
  switch (action.type) {
    case fromLoanPayee.LOAD_LOAN_PAYEE:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanPayee.LOAD_LOAN_PAYEE_SUCCESS:
      return Object.assign({}, state, {
        payee: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanPayee.LOAN_PAYEE_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromLoanPayee.LOAD_LOAN_PAYEE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting loan payee'
      });
    case fromLoanPayee.RESET_LOAN_PAYEE:
      return initialLoanPayeeState;
    default:
      return state;
  }
}
