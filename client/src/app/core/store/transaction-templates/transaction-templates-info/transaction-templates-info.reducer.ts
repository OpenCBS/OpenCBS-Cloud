import * as fromTransactionTemplatesInfo from './transaction-templates-info.actions';

// export interface TransactionTemplates {
//   id: number,
//   name: string,
//   accounts: []
// }

export interface TransactionTemplatesInfoState {
  transactionTemplatesInfo: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialTransactionTemplatesInfo: TransactionTemplatesInfoState = {
  transactionTemplatesInfo: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function transactionTemplatesInfoReducer(state = initialTransactionTemplatesInfo,
                                                action: fromTransactionTemplatesInfo.TransactionTemplatesInfoActions) {
  switch (action.type) {
    case fromTransactionTemplatesInfo.LOAD_TRANSACTION_TEMPLATES_INFO:
      return Object.assign({}, state, {
        loading: true
      });
    case fromTransactionTemplatesInfo.LOAD_TRANSACTION_TEMPLATES_INFO_SUCCESS:
      return Object.assign({}, state, {
        transactionTemplatesInfo: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromTransactionTemplatesInfo.TRANSACTION_TEMPLATES_INFO_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromTransactionTemplatesInfo.LOAD_TRANSACTION_TEMPLATES_INFO_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting transaction templates info'
      });
    case fromTransactionTemplatesInfo.RESET_TRANSACTION_TEMPLATES_INFO:
      return initialTransactionTemplatesInfo;
    default:
      return state;
  }
}
