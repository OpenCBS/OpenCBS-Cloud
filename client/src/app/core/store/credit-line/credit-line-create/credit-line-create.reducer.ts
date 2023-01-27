import * as fromCreditLineCreate from './credit-line-create.actions';

export interface ICreateCreditLine {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreateCreditLineState: ICreateCreditLine = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function creditLineCreateReducer(state = initialCreateCreditLineState,
                                        action: fromCreditLineCreate.CreditLineCreateActions) {
  switch (action.type) {
    case fromCreditLineCreate.CREATE_CREDIT_LINE_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromCreditLineCreate.CREATE_CREDIT_LINE_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: '',
        response: action.payload
      });
    case fromCreditLineCreate.CREATE_CREDIT_LINE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new credit line data',
        response: null
      });
    case fromCreditLineCreate.CREATE_CREDIT_LINE_RESET:
      return initialCreateCreditLineState;
    default:
      return state;
  }
}
