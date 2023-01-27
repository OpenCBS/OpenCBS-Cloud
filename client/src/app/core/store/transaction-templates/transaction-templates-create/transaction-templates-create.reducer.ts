import * as fromTransactionTemplatesCreate from './transaction-templates-create.actions';

export interface CreateTransactionTemplatesState {
  data: any;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreateTransactionTemplatesState: CreateTransactionTemplatesState = {
  data: null,
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function transactionTemplatesCreateReducer(state = initialCreateTransactionTemplatesState,
                                                  action: fromTransactionTemplatesCreate.TransactionTemplatesCreateActions) {
  switch (action.type) {
    case fromTransactionTemplatesCreate.CREATE_TRANSACTION_TEMPLATES_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromTransactionTemplatesCreate.CREATE_TRANSACTION_TEMPLATES_SUCCESS:
      return Object.assign({}, state, {
        data: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromTransactionTemplatesCreate.CREATE_TRANSACTION_TEMPLATES_FAILURE:
      return Object.assign({}, state, {
        data: null,
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new transaction templates data'
      });
    case fromTransactionTemplatesCreate.CREATE_TRANSACTION_TEMPLATES_RESET:
      return initialCreateTransactionTemplatesState;
    default:
      return state;
  }
}
