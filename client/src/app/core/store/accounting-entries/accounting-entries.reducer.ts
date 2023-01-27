import * as fromAccountingEntries from './accounting-entries.actions'


export interface IAccountingEntry {
  id: number;
  amount: number;
  description: string;
}

export interface IAccountingEntries {
  entries: IAccountingEntry[];
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

const initialState: IAccountingEntries = {
  entries: [],
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

export function accountingEntriesReducer(state = initialState, action: fromAccountingEntries.AccountingEntriesActions) {
  switch (action.type) {
    case fromAccountingEntries.LOAD_ACCOUNTING_ENTRIES:
      return Object.assign({}, state, {
        loading: true
      });
    case fromAccountingEntries.LOAD_ACCOUNTING_ENTRIES_SUCCESS:
      const entries = action.payload;
      return Object.assign({}, state, {
        entries: entries.content,
        totalPages: entries.totalPages,
        totalElements: entries.totalElements,
        currentPage: entries.number + 1,
        size: entries.size,
        numberOfElements: entries.numberOfElements,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromAccountingEntries.LOAD_ACCOUNTING_ENTRIES_FAILURE:
      return Object.assign({}, state, {
        entries: [],
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        size: 0,
        numberOfElements: 0,
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting accounting entries'
      });
    case fromAccountingEntries.RESET_ACCOUNTING_ENTRIES:
      return initialState;
  }

  return state;
}
