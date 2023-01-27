import * as fromTransactionTemplatesList from './transaction-templates-list.actions';

export interface TransactionTemplatesListState {
  transaction_templates: any[];
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

const initialTransactionTemplatesListState: TransactionTemplatesListState = {
  transaction_templates: [],
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


export function transactionTemplatesListReducer(state = initialTransactionTemplatesListState,
                                                action: fromTransactionTemplatesList.TransactionTemplatesListActions) {
  switch (action.type) {
    case fromTransactionTemplatesList.LOADING_TRANSACTION_TEMPLATES_LIST:
      return Object.assign({}, state, {
        loading: true
      });
    case fromTransactionTemplatesList.LOAD_TRANSACTION_TEMPLATES_LIST_SUCCESS:
      const transaction_templates = action.payload;
      return Object.assign({}, state, {
        transaction_templates: transaction_templates.content,
        totalPages: transaction_templates.totalPages,
        totalElements: transaction_templates.totalElements,
        size: transaction_templates.size,
        currentPage: transaction_templates.number,
        numberOfElements: transaction_templates.numberOfElements,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromTransactionTemplatesList.LOAD_TRANSACTION_TEMPLATES_LIST_FAILURE:
      return Object.assign({}, state, {
        transaction_templates: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting transaction temlates list'
      });
    default:
      return state;
  }
}
