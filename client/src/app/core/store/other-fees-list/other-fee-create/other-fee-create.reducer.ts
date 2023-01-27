import { ActionReducer } from '@ngrx/store';
import * as fromOtherFeeCreate from './other-fee-create.actions'


export interface CreateOtherFeeState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreateOtherFeeState: CreateOtherFeeState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function otherFeeCreateReducer(state = initialCreateOtherFeeState,
                                      action: fromOtherFeeCreate.OtherFeeCreateActions) {
  switch (action.type) {
    case fromOtherFeeCreate.CREATE_OTHER_FEE_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromOtherFeeCreate.CREATE_OTHER_FEE_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromOtherFeeCreate.CREATE_OTHER_FEE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new other fee data'
      });
    case fromOtherFeeCreate.CREATE_OTHER_FEE_RESET:
      return initialCreateOtherFeeState;
    default:
      return state;
  }
};
