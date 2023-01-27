import * as fromExchangeRate from './exchange-rate.actions';

export interface ExchangeRateState {
  transactions: any[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  size: number;
  numberOfElements: number;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialState: ExchangeRateState = {
  transactions: [],
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  size: 0,
  numberOfElements: 0,
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function exchangeRateReducer(state = initialState,
                                    action: fromExchangeRate.ExchangeRateActions) {
  switch (action.type) {
    case fromExchangeRate.LOADING_ER_TRANSACTIONS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromExchangeRate.LOAD_ER_TRANSACTIONS_SUCCESS:
      const transactions = action.payload;
      // const newTransactions = [...state.transactions];
      return Object.assign({}, state, {
        // transactions: [...newTransactions, ...transactions.content],
        transactions: transactions.content,
        totalPages: transactions.totalPages,
        totalElements: transactions.totalElements,
        size: transactions.size,
        currentPage: transactions.number + 1,
        numberOfElements: transactions.numberOfElements,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromExchangeRate.LOAD_ER_TRANSACTIONS_FAILURE:
      return Object.assign({}, state, {
        totalPages: 0,
        totalElements: 0,
        size: 0,
        currentPage: 0,
        numberOfElements: 0,
        loaded: true,
        loading: false,
        success: false,
        error: true,
        errorMessage: ''
      });
    case fromExchangeRate.RESET_ER_TRANSACTIONS:
      return initialState;
    default:
      return state;
  }
}
