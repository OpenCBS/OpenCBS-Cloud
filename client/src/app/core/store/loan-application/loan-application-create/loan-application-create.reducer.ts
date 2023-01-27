import * as fromLoanAppCreate from './loan-application-create.actions';

export interface ILoanAppCreateState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
  response: any;
}

const initialCreateLoanApplicationState: ILoanAppCreateState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: '',
  response: null
};

export function loanApplicationCreateReducer(state = initialCreateLoanApplicationState,
                                             action: fromLoanAppCreate.LoanApplicationCreateActions) {
  switch (action.type) {
    case fromLoanAppCreate.CREATE_LOAN_APPLICATION_LOADING:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromLoanAppCreate.CREATE_LOAN_APPLICATION_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: '',
        response: action.payload
      });
    case fromLoanAppCreate.CREATE_LOAN_APPLICATION_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new loan application data',
        response: null
      });
    case fromLoanAppCreate.CREATE_LOAN_APPLICATION_RESET:
      return initialCreateLoanApplicationState;
    default:
      return state;
  }
};
