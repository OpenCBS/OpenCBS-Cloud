import * as fromLoanAppUpdate from './loan-application-update.actions';

export interface ILoanAppUpdateState {
  response: any;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateLoanApplicationState: ILoanAppUpdateState = {
  response: null,
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanApplicationUpdateReducer(state = initialUpdateLoanApplicationState,
                                             action: fromLoanAppUpdate.LoanApplicationUpdateActions) {
  switch (action.type) {
    case fromLoanAppUpdate.UPDATE_LOAN_APPLICATION_LOADING:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromLoanAppUpdate.UPDATE_LOAN_APPLICATION_SUCCESS:
      return Object.assign({}, state, {
        response: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanAppUpdate.UPDATE_LOAN_APPLICATION_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new loan application data'
      });
    case fromLoanAppUpdate.UPDATE_LOAN_APPLICATION_RESET:
      return initialUpdateLoanApplicationState;
    default:
      return state;
  }
};
