import * as fromLoanApplicationFields from './loan-application-fields.actions';

export interface LoanApplicationFieldsState {
  loanAppFields: any[];
  loading: boolean;
  loaded: boolean;
  type: string;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialLoanApplicationFieldsState = {
  loanAppFields: [],
  loading: false,
  loaded: false,
  type: '',
  success: false,
  error: false,
  errorMessage: ''
};

export function loanApplicationFieldsReducer(state = initialLoanApplicationFieldsState,
                                             action: fromLoanApplicationFields.LoanApplicationFieldsAction) {
  switch (action.type) {
    case fromLoanApplicationFields.LOADING_LOAN_APPLICATION_FIELDS_META:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanApplicationFields.LOAD_LOAN_APPLICATION_FIELDS_META_SUCCESS:
      return Object.assign({}, state, {
        loanAppFields: action.payload,
        loading: false,
        loaded: true,
        type: action.payload.type,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanApplicationFields.LOAD_LOAN_APPLICATION_FIELDS_META_FAILURE:
      return Object.assign({}, state, {
        loanAppFields: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting field'
      });
    case fromLoanApplicationFields.RESET_LOAN_APPLICATION_FIELDS_META:
      return initialLoanApplicationFieldsState;
    default:
      return state;
  }
};
