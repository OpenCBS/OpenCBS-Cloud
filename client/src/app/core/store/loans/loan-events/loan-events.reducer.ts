import * as fromLoanEventsActions from './loan-events.actions';

export interface ILoanEvents {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
  loanEvents: any;
}

const initialLoanState: ILoanEvents = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: '',
  loanEvents: null
};

export function loanEventsReducer(state = initialLoanState,
                                          action: fromLoanEventsActions.LoanEventsActions) {
  switch (action.type) {
    case fromLoanEventsActions.LOAD_LOAN_EVENTS:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromLoanEventsActions.LOAN_EVENTS_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: '',
        loanEvents: action.payload
      });
    case fromLoanEventsActions.LOAN_EVENTS_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting loan events',
        loanEvents: null
      });
    case fromLoanEventsActions.LOAN_EVENTS_RESET:
      return initialLoanState;
    default:
      return state;
  }
}
