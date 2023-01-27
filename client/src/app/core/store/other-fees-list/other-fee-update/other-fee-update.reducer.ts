import { ActionReducer } from '@ngrx/store';
import * as fromOtherFeeUpdate from './other-fee-update.actions';

export interface UpdateOtherFeeState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateOtherFeeState: UpdateOtherFeeState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function otherFeeUpdateReducer(state = initialUpdateOtherFeeState,
                                      action: fromOtherFeeUpdate.OtherFeeUpdateActions) {
  switch (action.type) {
    case fromOtherFeeUpdate.UPDATE_OTHER_FEE_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromOtherFeeUpdate.UPDATE_OTHER_FEE_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromOtherFeeUpdate.UPDATE_OTHER_FEE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new otherFee data'
      });
    case fromOtherFeeUpdate.UPDATE_OTHER_FEE_RESET:
      return initialUpdateOtherFeeState;
    default:
      return state;
  }
};
