import * as fromEntryFeeList from './entry-fee-list.actions';

export interface EntryFee {
  id: number;
  name: string;
  minValue: number;
  maxValue: number;
  minLimit: number;
  maxLimit: number;
  percentage: boolean;
}

export interface EntryFeeListState {
  entryFees: EntryFee[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialEntryFeeListState: EntryFeeListState = {
  entryFees: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function entryFeeListReducer(state = initialEntryFeeListState,
                                    action: fromEntryFeeList.EntryFeeListActions) {
  switch (action.type) {
    case fromEntryFeeList.LOADING_ENTRY_FEES:
      return Object.assign({}, state, {
        loading: true
      });
    case fromEntryFeeList.LOAD_ENTRY_FEES_SUCCESS:
      const entryFees = action.payload;
      return Object.assign({}, state, {
        entryFees: entryFees,
        loaded: true,
        loading: false,
        success: true
      });
    case fromEntryFeeList.LOAD_ENTRY_FEES_FAILURE:
      return Object.assign({}, state, {
        entryFees: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting entry fees list'
      });
    case fromEntryFeeList.ENTRY_FEE_LIST_RESET:
      return initialEntryFeeListState;
    default:
      return state;
  }
}
