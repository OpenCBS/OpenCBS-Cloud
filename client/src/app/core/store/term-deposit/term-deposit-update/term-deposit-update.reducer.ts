import * as fromTermDepositUpdate from './term-deposit-update.actions';

export interface ITermDepositUpdateState {
  response: any;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateTermDepositState: ITermDepositUpdateState = {
  response: null,
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function termDepositUpdateReducer(state = initialUpdateTermDepositState,
                                         action: fromTermDepositUpdate.TermDepositUpdateActions) {
  switch (action.type) {
    case fromTermDepositUpdate.UPDATE_TERM_DEPOSIT_LOADING:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromTermDepositUpdate.UPDATE_TERM_DEPOSIT_SUCCESS:
      return Object.assign({}, state, {
        response: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromTermDepositUpdate.UPDATE_TERM_DEPOSIT_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error term deposit new Term deposit'
      });
    case fromTermDepositUpdate.UPDATE_TERM_DEPOSIT_RESET:
      return initialUpdateTermDepositState;
    default:
      return state;
  }
};
