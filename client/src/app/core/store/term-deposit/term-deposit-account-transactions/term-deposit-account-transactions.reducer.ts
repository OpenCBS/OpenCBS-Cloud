import * as fromTermDepositAccTransactions from './term-deposit-account-transactions.actions';

export interface ITermDepositAccountTransactions {
  transactions: any[];
  totalPages: number;
  totalElements: number;
  termDepositPage: number;
  size: number;
  numberOfElements: number;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialState: ITermDepositAccountTransactions = {
  transactions: [],
  totalPages: 0,
  totalElements: 0,
  termDepositPage: 0,
  size: 0,
  numberOfElements: 0,
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function termDepositAccountTransactionsReducer(state = initialState,
                                                      action: fromTermDepositAccTransactions.TermDepositAccountTransactionsActions) {
  switch (action.type) {
    case fromTermDepositAccTransactions.LOADING_TDA_TRANSACTIONS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromTermDepositAccTransactions.LOAD_TDA_TRANSACTIONS_SUCCESS:
      const transactions = action.payload;
      const newTransactions = [...state.transactions];
      return Object.assign({}, state, {
        transactions: [...newTransactions, ...transactions.content],
        totalPages: transactions.totalPages,
        totalElements: transactions.totalElements,
        size: transactions.size,
        termDepositPage: transactions.number + 1,
        numberOfElements: transactions.numberOfElements,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromTermDepositAccTransactions.LOAD_TDA_TRANSACTIONS_FAILURE:
      return Object.assign({}, state, {
        totalPages: 0,
        totalElements: 0,
        size: 0,
        termDepositPage: 0,
        numberOfElements: 0,
        loaded: true,
        loading: false,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting transactions'
      });
    case fromTermDepositAccTransactions.RESET_TDA_TRANSACTIONS:
      return initialState;
    default:
      return state;
  }
}
