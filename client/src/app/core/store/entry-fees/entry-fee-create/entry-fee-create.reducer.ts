import { ActionReducer } from '@ngrx/store';
import * as fromEntryFeeCreate from './entry-fee-create.actions'


export interface CreateEntryFeeState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreateEntryFeeState: CreateEntryFeeState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function entryFeeCreateReducer(state = initialCreateEntryFeeState,
                                      action: fromEntryFeeCreate.EntryFeeCreateActions) {
  switch (action.type) {
    case fromEntryFeeCreate.CREATE_ENTRY_FEE_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromEntryFeeCreate.CREATE_ENTRY_FEE_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromEntryFeeCreate.CREATE_ENTRY_FEE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new entry fee data'
      });
    case fromEntryFeeCreate.CREATE_ENTRY_FEE_RESET:
      return initialCreateEntryFeeState;
    default:
      return state;
  }
};
