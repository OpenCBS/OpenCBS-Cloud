import * as fromLoanPayeeEventsActions from './loan-payee-events.actions';

export interface LoanPayeeEventsState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
  loanPayeeEvents: any;
}

const initialLoanPayeeState: LoanPayeeEventsState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: '',
  loanPayeeEvents: null
};

export function loanPayeeEventsReducer(state = initialLoanPayeeState,
                                       action: fromLoanPayeeEventsActions.LoanPayeeEventsActions) {
  switch (action.type) {
    case fromLoanPayeeEventsActions.LOAN_PAYEE_EVENTS_LOADING:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromLoanPayeeEventsActions.LOAN_PAYEE_EVENTS_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: '',
        loanPayeeEvents: action.payload
      });
    case fromLoanPayeeEventsActions.LOAN_PAYEE_EVENTS_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting loan payee events',
        loanPayeeEvents: null
      });
    case fromLoanPayeeEventsActions.LOAN_PAYEE_EVENTS_RESET:
      return initialLoanPayeeState;
    default:
      return state;
  }
}
