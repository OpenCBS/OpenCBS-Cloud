import * as fromCreditLineUpdate from './credit-line-update.actions';

export interface IUpdateCreditLine {
  data: any;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateCreditLineState: IUpdateCreditLine = {
  data: null,
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function creditLineUpdateReducer(state = initialUpdateCreditLineState,
                                        action: fromCreditLineUpdate.CreditLineUpdateActions) {
  switch (action.type) {
    case fromCreditLineUpdate.UPDATE_CREDIT_LINE_LOADING:
      return Object.assign({}, state, {
        loading: true,
      });
    case fromCreditLineUpdate.UPDATE_CREDIT_LINE_SUCCESS:
      return Object.assign({}, state, {
        data: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromCreditLineUpdate.UPDATE_CREDIT_LINE_FAILURE:
      return Object.assign({}, state, {
        data: null,
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error credit line state data'
      });
    case fromCreditLineUpdate.UPDATE_CREDIT_LINE_RESET:
      return initialUpdateCreditLineState;
    default:
      return state;
  }
}
