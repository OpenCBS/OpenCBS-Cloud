import * as fromTransactionTemplatesUpdate from './transaction-templates-update.actions';

export interface UpdateTransactionTemplatesState {
  data: any;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateTransactionTemplatesState: UpdateTransactionTemplatesState = {
  data: null,
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function transactionTemplatesUpdateReducer(state = initialUpdateTransactionTemplatesState,
                                                  action: fromTransactionTemplatesUpdate.TransactionTemplatesUpdateActions) {
  switch (action.type) {
    case fromTransactionTemplatesUpdate.UPDATE_TRANSACTION_TEMPLATES_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromTransactionTemplatesUpdate.UPDATE_TRANSACTION_TEMPLATES_SUCCESS:
      return Object.assign({}, state, {
        data: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromTransactionTemplatesUpdate.UPDATE_TRANSACTION_TEMPLATES_FAILURE:
      return Object.assign({}, state, {
        data: null,
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving transaction templates-state data'
      });
    case fromTransactionTemplatesUpdate.UPDATE_TRANSACTION_TEMPLATES_RESET:
      return initialUpdateTransactionTemplatesState;
    default:
      return state;
  }
}
