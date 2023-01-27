import * as fromCreditLine from './credit-line.actions';

export interface ICreditLine {
  creditLine: any[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreditLineState: ICreditLine = {
  creditLine: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function creditLineReducer(state = initialCreditLineState,
                                  action: fromCreditLine.CreditLineActions) {
  switch (action.type) {
    case fromCreditLine.LOAD_CREDIT_LINE:
      return Object.assign({}, state, {
        loading: true
      });
    case fromCreditLine.LOAD_CREDIT_LINE_SUCCESS:
      const creditLine = action.payload;
      return Object.assign({}, state, {
        creditLine: creditLine,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromCreditLine.LOAD_CREDIT_LINE_FAILURE:
      return Object.assign({}, state, {
        creditLine: [],
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: action.payload.message || 'Error getting credit line'
      });
    default:
      return state;
  }
}
