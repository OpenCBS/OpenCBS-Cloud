import * as fromTermDepositCreateActions from './term-deposit-create.actions';

export interface ITermDepositCreateState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
  response: any;
}

const initialCreateTermDepositState: ITermDepositCreateState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: '',
  response: null
};

export function termDepositCreateReducer(state = initialCreateTermDepositState,
                                         action: fromTermDepositCreateActions.TermDepositCreateActions) {
  switch (action.type) {
    case fromTermDepositCreateActions.CREATE_TERM_DEPOSIT_LOADING:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromTermDepositCreateActions.CREATE_TERM_DEPOSIT_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: '',
        response: action.payload
      });
    case fromTermDepositCreateActions.CREATE_TERM_DEPOSIT_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error term deposit new term deposit data',
        response: null
      });
    case fromTermDepositCreateActions.CREATE_TERM_DEPOSIT_RESET:
      return initialCreateTermDepositState;
    default:
      return state;
  }
}
