import * as fromCurrentAccTransactions from './current-account-transactions.actions';

export interface ICurrentAccountTransactions {
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

const initialState: ICurrentAccountTransactions = {
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

export function currentAccountTransactionsReducer(state = initialState,
                                                  action: fromCurrentAccTransactions.CurrentAccountTransactionsActions) {
  switch (action.type) {
    case fromCurrentAccTransactions.LOADING_CA_TRANSACTIONS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromCurrentAccTransactions.LOAD_CA_TRANSACTIONS_SUCCESS:
      const transactions = action.payload;
      return Object.assign({}, state, {
        transactions: transactions.content,
        totalPages: transactions.totalPages,
        totalElements: transactions.totalElements,
        size: transactions.size,
        currentPage: transactions.number,
        numberOfElements: transactions.numberOfElements,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromCurrentAccTransactions.LOAD_CA_TRANSACTIONS_FAILURE:
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
        errorMessage: action.payload.message || 'Error getting transactions'
      });
    case fromCurrentAccTransactions.RESET_CA_TRANSACTIONS:
      return initialState;
    default:
      return state;
  }
}
