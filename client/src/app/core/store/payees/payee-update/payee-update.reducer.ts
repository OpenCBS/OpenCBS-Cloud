import { ActionReducer } from '@ngrx/store';
import * as fromPayeeUpdate from './payee-update.actions';

export interface UpdatePayeeState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdatePayeeState: UpdatePayeeState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function payeeUpdateReducer(state = initialUpdatePayeeState, action: fromPayeeUpdate.PayeeUpdateActions) {
  switch (action.type) {
    case fromPayeeUpdate.UPDATE_PAYEE_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromPayeeUpdate.UPDATE_PAYEE_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromPayeeUpdate.UPDATE_PAYEE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new payee data'
      });
    case fromPayeeUpdate.UPDATE_PAYEE_RESET:
      return initialUpdatePayeeState;
    default:
      return state;
  }
};
