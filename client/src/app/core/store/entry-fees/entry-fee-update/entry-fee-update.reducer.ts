import { ActionReducer } from '@ngrx/store';
import * as fromEntryFeeUpdate from './entry-fee-update.actions';

export interface UpdateEntryFeeState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateEntryFeeState: UpdateEntryFeeState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function entryFeeUpdateReducer(state = initialUpdateEntryFeeState,
                                      action: fromEntryFeeUpdate.EntryFeeUpdateActions) {
  switch (action.type) {
    case fromEntryFeeUpdate.UPDATE_ENTRY_FEE_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromEntryFeeUpdate.UPDATE_ENTRY_FEE_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromEntryFeeUpdate.UPDATE_ENTRY_FEE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new entryFee data'
      });
    case fromEntryFeeUpdate.UPDATE_ENTRY_FEE_RESET:
      return initialUpdateEntryFeeState;
    default:
      return state;
  }
};
