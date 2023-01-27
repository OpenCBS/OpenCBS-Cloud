import * as fromTermDeposit from './term-deposit.actions';

export interface ITermDepositState {
  termDeposit: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialTermDepositState: ITermDepositState = {
  termDeposit: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function termDepositReducer(state = initialTermDepositState,
                                   action: fromTermDeposit.TermDepositActions) {
  switch (action.type) {
    case fromTermDeposit.LOADING_TERM_DEPOSIT:
      return Object.assign({}, state, {
        loading: true
      });
    case fromTermDeposit.LOAD_TERM_DEPOSIT_SUCCESS:
      return Object.assign({}, state, {
        termDeposit: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromTermDeposit.TERM_DEPOSIT_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromTermDeposit.LOAD_TERM_DEPOSIT_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting term deposit'
      });
    case fromTermDeposit.RESET_TERM_DEPOSIT:
      return initialTermDepositState;
    default:
      return state;
  }
}
